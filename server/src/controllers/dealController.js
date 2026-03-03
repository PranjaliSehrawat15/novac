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

//get all deals
exports.getAllDeals = async(req, res) => {
    try{
        let deals;
        if(req.user.role === "admin") {
            deals = await Deal.find()
                .populate("lead", "name email")
                .populate("assignedTo", "name email");
        }else {
      deals = await Deal.find({ assignedTo: req.user.id })
        .populate("lead", "name email")
        .populate("assignedTo", "name email");
    }

    res.status(200).json({
      success: true,
      count: deals.length,
      data: deals,
    });
    }catch(error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}