import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    itemDescription: {
        type: String,
        required: true,
    },
    itemPrice: {
        type: Number,
        default: 0,
        validate: {
            validator: function(v) {
                return v > 0;
            },
            message: props => `${props.value} is not a valid price!`
        }
    },

    itemCategory: {
        type: String,
        required: true,
    },
    itemPhoto: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    itemStartDate: {
        type: Date,
        default: Date.now
    },
    itemEndDate: {
        type: Date,
        required: "Auction end time is required",
        validate: {
            validator: function(v) {
                return v > this.itemStartDate;
            },
            message: props => `End date must be after start date!`
        }
    },

    seller: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    bids: [{
        bidder: { type: mongoose.Schema.ObjectId, ref: 'User' },
        bid: Number,
        time: Date
    }],
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
