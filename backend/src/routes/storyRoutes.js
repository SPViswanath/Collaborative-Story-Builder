const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadImage");
const {createStory, 
        addCollaborator, 
        getMyOngoingStories,
        getMyPublishedStories, 
        publishToggleStory, 
        getPublicPublishedStories, 
        getCollaborators,
        removeCollaborator,
        deleteStory,
        getStoryById,
        getPublicStoryById,
        updateStory,
        uploadStoryImage,
        exportStoryPDF
    } = require("../controllers/storyController");

router.post("/",authMiddleware,createStory);

router.post("/:storyId/collaborators", authMiddleware, addCollaborator);

router.get("/my/ongoing", authMiddleware, getMyOngoingStories);

router.get("/my/published", authMiddleware, getMyPublishedStories);

router.patch("/:storyId/publish",authMiddleware,publishToggleStory);

router.get("/:storyId/export/pdf",exportStoryPDF);

router.get("/published", getPublicPublishedStories);

router.get("/:storyId/collaborators", authMiddleware, getCollaborators);

router.delete(
  "/:storyId/collaborators/:collaboratorId",
  authMiddleware,
  removeCollaborator
);

router.get("/public/:storyId", getPublicStoryById);

router.delete("/:storyId", authMiddleware, deleteStory);

router.patch("/:storyId", authMiddleware, updateStory);

router.get("/:storyId",authMiddleware, getStoryById);

router.put(
  "/:storyId/image",
  authMiddleware,
  upload.single("image"),
  uploadStoryImage
);

module.exports = router;