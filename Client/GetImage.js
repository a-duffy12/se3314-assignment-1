let net = require("net");
let fs = require("fs");
let open = require("open");
let ITPpacket = require("./ITPRequest");

// Enter your code for the client functionality here
let client = new net.Socket(); // create a socket
let longAddress = process.argv[3]; // get address and port of server from command
let port = longAddress.substring(longAddress.indexOf(':')+1); // get server's port
let address = longAddress.slice(0, longAddress.indexOf(':')); // get server's address

let file = process.argv[5]; // get file from command
let version = process.argv[7]; // get version from command

// function to connect to the image server
client.connect(port, address, () => {
    
    console.log(`Connected to ImageDB server on: ${address}:${port}`);
    
    ITPpacket.init(version, 0, file); // build packet
    client.write(ITPpacket.getBytePacket()); // send packet
})

// handle server response
client.on('data', (res) => {

    // read data from response packet
    let v = res.slice(0, 2).readUInt16BE(0);
    let t = res.slice(3).readUInt8(0);
    let sq = res.slice(4, 7).readUInt16BE(0);
    let ts = res.slice(8, 11).readUInt16BE(0);
    let sz = res.slice(12, 15).readUInt16BE(0);

    // output response
    console.log("Server sent:")
    console.log(`   --ITP Version = ${v}`)
    //if () // TODO fulfilled bit
    if (t == 0)
    {
        console.log(`   --Response Type = Query`);
    }
    else if (t == 1)
    {
        console.log(`   --Response Type = Found`);
    }
    else if (t == 2)
    {
        console.log(`   --Response Type = Not Found`);
    }
    else if (t == 3)
    {
        console.log(`   --Response Type = Busy`);
    }
    //console.log(`   --Image Count = ${}`); // TODO
    console.log(`   --Sequence Number = ${sq}`);
    console.log(`   --Timestamp = ${ts}\n`);

    // read image(s)
    if (t == 1)
    {
        fs.writeFile(`received_${sq}.jpg`, res.slice(16), (err) => {

            if (err)
            {
                throw err;
            }

            open(`received_${sq}.jpg`).then(() => {}); // open received image
        })
    }

    client.destroy(); // destroy packet after receiving it
    console.log("Disconnected from the server");
})

client.on("close", () => {
    console.log("Connection closed\n");
})
