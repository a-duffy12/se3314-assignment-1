// You may need to add some delectation here
let packet; // packet object
let image; // image object

// allocate bits for packet
let version = Buffer.alloc(3);
let ful = Buffer.alloc(1);
let type = Buffer.alloc(1);
let seqNum = Buffer.alloc(4);
let timestamp = Buffer.alloc(4);
let ext = Buffer.alloc(4);
let size = Buffer.alloc(2);

module.exports = {

    init: function(v, f, t, sq, ts, e, sz, i) { // feel free to add function parameters as needed
        
        // write data to the packet
        version.writeUInt16BE(v);
        ful.writeUInt8(f);
        type.writeUInt8(t);
        seqNum.writeInt16BE(sq);
        timestamp.writeInt16BE(ts);
        ext.writeInt16BE(e);
        size.writeInt16BE(sz);
        image = i;

        // create the packet
        packet = Buffer.concat([version, ful, type, seqNum, timestamp, ext, size, image], version.length + ful.length + type.length + seqNum.length + timestamp.length + ext.length + size.length + image.length);
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