// You may need to add some delectation here
let packet; // packet object
let image; // image object

// allocate bits for packet
let version = Buffer.alloc(3);
let type = Buffer.alloc(1);
let seqNum = Buffer.alloc(4);
let timestamp = Buffer.alloc(4);
let size = Buffer.alloc(4);


module.exports = {

    init: function(v, t, sq, ts, sz, i) { // feel free to add function parameters as needed
        
        // write data to the packet
        version.writeUInt16BE(v);
        type.writeUInt8(t);
        seqNum.writeInt16BE(sq);
        timestamp.writeInt16BE(ts);
        size.writeInt16BE(sz);
        image = i;

        // create the packet
        packet = Buffer.concat([version, type, seqNum, timestamp, size, image], version.length + type.length + seqNum.length + timestamp.length + size.length + image.length);
    },

    //getpacket: returns the entire packet
    getPacket: function() {
        
        return packet;
    },

    getLength: function() {

        return packet.length;
    }
};

// Extra utility methods can be added here