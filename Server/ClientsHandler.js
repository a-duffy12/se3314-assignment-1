let ITPpacket = require('./ITPResponse');
let singleton = require('./Singleton');

// You may need to add some delectation here
const fs = require('fs');

let currentTime;
let currentSeq;

module.exports = {

    handleClientJoining: function (sock) {
        
        currentTime = singleton.getTimestamp(); // get current time stamp
        currentSeq = singleton.getSequenceNumber(); // get current sequence number

        console.log(`Client-${currentTime} is connected at timestamp: ${currentTime}\n`);
        sock.on("data", getData); // output packet info from the socket
        console.log(" ");
        sock.on("close", (data) => {
            console.log(`Client-${currentTime} closed the connection\n`);
        });

        // function to get packet data from the client and output it
        function getData(data) 
        {
            if (data.slice(0, 4).length == 4)
            {
                // get information from packet
                var version = data.slice(0, 2).readUInt16BE(0);
                var type = data.slice(3).readUInt8(0).toString();
                var name = data.slice(4).toString();

                console.log(`Client-${currentTime} requests:`);
                console.log(`   --ITP Version: ${version}`);
                console.log(`   --Request Type: ${type}`);
                console.log(`   --Image Count:`);
                console.log(`   --Image File Name(s): ${name}`);

                var resType = 0; // create query for response

                // get requested images
                fs.readdir('./images', (err, list) => {
                
                    for (let i = 0; i < list.length; i++)
                    {
                        if (name == list[i])
                        {
                            resType = 1;
                        }
                    }

                    var imageData, packet;

                    if (resType == 0) // image(s) not found
                    {
                        imageData = Buffer.alloc(1); // allocate bit
                        ITPpacket.init(version, resType, currentSeq, currentTime, 0, imageData); // create a packet

                        packet = ITPpacket.getPacket(); // build packet
                        sock.write(packet); // send packet
                    }
                    else if (resType == 1) // image(s) found
                    {
                        fs.readFile("./images" + '\\' + name, (err, con) => {
                            
                            if (err)
                            {
                                throw err;
                            }

                            let size = con.length;
                            imageData = con;

                            ITPpacket.init(verion, resType, currentSeq, currentTime, size, imageData); // create a packet

                            packet = ITPpacket.getPacket(); // build packet
                            sock.write(packet); // send packet
                        })
                    }
                })
            }
        }    
    }
};
