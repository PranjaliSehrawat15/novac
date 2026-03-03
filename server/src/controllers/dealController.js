const Deal = require("../models/Deals");

// create Deal
exports.createDeal = async(req, res) => {
    try {

        const deal = await Deal.create({
            ...req.body,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success:true,
            data:deal,
        });

    }catch(error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}