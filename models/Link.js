
import mongoose from 'mongoose';

// עדכון ה-ClickSchema
const ClickSchema = new mongoose.Schema({
    insertedAt: { type: Date, default: Date.now }, 
    ipAddress: { type: String, required: true },
    targetParamValue: { type: String } 
}, { _id: false }); // אפשר להסיר את ה-_id מקליקים אם אין צורך

// עדכון ה-LinkSchema
const LinkSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    clicks: [ClickSchema],
    targetParamName: { type: String, default: "t" }, 
    targetValues: [{ 
        name: { type: String, required: true }, 
        value: { type: String, required: true }  
    }]
});

const Link = mongoose.model('Link', LinkSchema);

export default Link;
