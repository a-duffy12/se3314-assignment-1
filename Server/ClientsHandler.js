// You may need to add some delectation here
const fs = require('fs');
let ITPpacket = require('./ITPResponse');
let singleton = require('./Singleton');


let currentTime;
let currentSeq;

module.exports = {

    handleClientJoining: function (sock) {
        
        currentTime = singleton.getTimestamp(); // get current time stamp
        currentSeq = singleton.getSequenceNumber(); // get current sequence number

        console.log(`Client-${currentSeq} is connected at timestamp: ${currentTime}\n`);
        sock.on("data", getData); // output packet info from the socket
        console.log("");
        sock.on("close", (req) => {
            console.log(`Client-${currentTime} closed the connection\n`);
        });

        // function to get packet data from the client and output it
        function getData(data) 
        {
            // get information from packet
            var version = data.slice(0, 2).readUInt16BE(0);
            var type = data.slice(3).readUInt8(0).toString();
            var name = data.slice(4).toString();

            console.log(`Client-${currentSeq} requests:`);
            console.log(`   --ITP Version: ${version}`);
            console.log(`   --Request Type: ${type}`);
            console.log(`   --Image Count:`);
            console.log(`   --Image File Name(s): ${name}\n`);

            var resType = 2; // create query for response
            var resCount = 0; // count how many are returned

            // check packet contents are ok
            var ok = false;

            if (version == 7 && type == 0 && name != "")
            {
                ok = true; // allow request
            }

            if (!ok) // bad request
            {
                var resData = "BAD ITP REQUEST";
                let res = Buffer.from(resData);

                ITPpacket.init(version, 3, currentSeq, currentTime, 0, res);

                packet = ITPpacket.getPacket();
                sock.write(packet); // send packet
            }
            else // good request
            {
                // get requested images
                fs.readdir('./images', (err, list) => {
                
                    for (let i = 0; i < list.length; i++)
                    {
                        if (name == list[i])
                        {
                            resType = 1;
                            resCount++;
                        }
                    }

                    var imageData; // data for image
                    var packet; // packet to send

                    if (resType == 2) // image(s) not found
                    {
                        imageData = Buffer.alloc(1); // allocate bit
                        ITPpacket.init(version, resType, resCount, currentSeq, currentTime, 0, imageData); // create a packet

                        packet = ITPpacket.getPacket(); // build packet
                        sock.write(packet); // send packet
                    }
                    else if (resType == 1) // image(s) found
                    {
                        fs.readFile("./images/" + name, (err, con) => {
                            
                            if (err)
                            {
                                throw err;
                            }

                            let size = con.length;
                            imageData = con;

                            ITPpacket.init(version, resType, currentSeq, currentTime, size, imageData); // create a packet

                            packet = ITPpacket.getPacket(); // build packet
                            sock.write(packet); // send packet
                        })
                    }
                })
            }
        }    
    }
};
