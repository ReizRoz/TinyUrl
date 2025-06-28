import Link from "../models/Link.js";
const linksController = {
  getAll: async (req, res) => {
    try {
      const links = await Link.find();
      res.send(links);
    } catch (err) {
      res.status(500).send({ error: "Failed to retrieve links", details: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const lid = req.params.id;
      const linkById = await Link.findById(lid);
      if (linkById) res.send(linkById);
      else res.status(404).send({ error: "Link not found" });
    } catch (err) {
      res.status(400).send({ error: "Invalid ID", details: err.message });
    }
  },

  post: async (req, res) => {
    try {
      const { originalUrl, userId } = req.body;
  
      if (!originalUrl || !userId) {
        return res.status(400).send({ error: "originalUrl and userId are required" });
      }
  
      const newLink = new Link({ originalUrl });
      const savedLink = await newLink.save();
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).send({ error: "User not found" });
      user.links.push(savedLink._id); 
      await user.save();      
      res.status(201).send(savedLink);
    } catch (err) {
      res.status(400).send({ error: "Failed to create link", details: err.message });
    }
  },
  put: async (req, res) => {
    try {
      const lid = req.params.id;
      const updatedLink = await Link.findByIdAndUpdate(lid, req.body, {
        new: true,
        runValidators: true,
      });
      if (updatedLink) res.status(200).send(updatedLink);
      else res.status(404).send({ error: "Link not found" });
    } catch (err) {
      res.status(400).send({ error: "Invalid ID or data", details: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const linkId = req.params.id;
      const deletedLink = await Link.findByIdAndDelete(linkId);
      if (deletedLink) res.status(200).send({ message: "Link deleted successfully", link: deletedLink });
      else res.status(404).send({ error: "Link not found" });
    } catch (err) {
      res.status(400).send({ error: "Invalid ID", details: err.message });
    }
  },
  redirectToOriginalUrl: async (req, res) => {
    try {
        const linkId = req.params.id;
        const link = await Link.findById(linkId);

        if (!link) {
            return res.status(404).send({ error: "Link not found" });
        }
        
        const targetValue = req.query[link.targetParamName];

        const ipAddress = req.ip || req.connection.remoteAddress;
        const newClick = {
            insertedAt: new Date(),
            ipAddress: ipAddress,
            // ⭐️ שלב 2: הוספת הערך לאובייקט הקליק
            targetParamValue: targetValue 
        };

        link.clicks.push(newClick);
        await link.save();
        
        res.redirect(301, link.originalUrl); // מומלץ לציין status code של הפניה קבועה

    } catch (err) {
        console.error("Error in redirectToOriginalUrl:", err);
        res.status(500).send({ error: "Failed to redirect or track click", details: err.message });
    }
  },
  getAnalytics: async (req, res) => {
    try {
        const link = await Link.findById(req.params.id);
        if (!link) {
            return res.status(404).send({ error: "Link not found" });
        }

        const analytics = {};

        link.targetValues.forEach(target => {
            analytics[target.name] = 0;
        });

        link.clicks.forEach(click => {
            const targetInfo = link.targetValues.find(t => t.value === click.targetParamValue);
            if (targetInfo) {
                analytics[targetInfo.name]++;
            }
        });

        res.send(analytics); 

    } catch (err) {
        res.status(500).send({ error: "Failed to retrieve analytics", details: err.message });
    }
}
}


export default linksController;
