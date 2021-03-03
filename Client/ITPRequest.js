// You may need to add some delectation here
let packet; // packet object
let name; // image name
let ext; // image extension

// allocate bits for packet
let version = Buffer.alloc(3);
let count = Buffer.alloc(5); // TODO
let type = Buffer.alloc(1); 

module.exports = {
  init: function (v, t, i) { // feel free to add function parameters as needed
    
    // write data to the packet
    version.writeUInt16BE(v);
    type.writeUInt8(t);
    name = i;

    // create the packet
    packet = Buffer.concat([version, type, Buffer.from(name)], version.length + type.length + name.length);
  },

  //getBytePacket: returns the entire packet in bytes
  getBytePacket: function () {
    // enter your code here
    return packet;
  },

  //getBitPacket: returns the entire packet in bits format
  getBitPacket: function () {
    // enter your code here
    return packet.toString('binary');
  },
};

// Extra utility methods can be added here