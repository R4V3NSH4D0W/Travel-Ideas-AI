import axios from "axios";
import { GOOGLE_API_KEY } from "../env";

export const fetchDescriptionFromWikipedia = async (entityName) => {
  try {
    const fetchFromWikipedia = async (title) => {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${encodeURIComponent(
          title
        )}&exintro=true&explaintext=true`
      );

      const pages = response.data.query.pages;
      const page = Object.values(pages)[0];
      return page.extract || null;
    };

    let description = await fetchFromWikipedia(entityName);

    if (description) {
      return description;
    }

    // If description is empty, try slicing the title
    const titleParts = entityName.split(" ");
    if (titleParts.length > 1) {
      // Slice the title into two parts and attempt to fetch again
      const firstHalfTitle = titleParts
        .slice(0, Math.ceil(titleParts.length / 2))
        .join(" ");
      description = await fetchFromWikipedia(firstHalfTitle);

      if (description) {
        return description;
      }
    }

    // If still no description found, return "Description not available."
    return "Description not available.";
  } catch (error) {
    console.error("Error fetching Wikipedia description:", error);
    return "Error fetching description.";
  }
};

export const analyzeImage = async (
  base64Image,
  setLoading,
  setTitle,
  setDetails
) => {
  setLoading(true);

  const url = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`;

  const body = {
    requests: [
      {
        image: {
          content: base64Image,
        },
        features: [
          {
            type: "LANDMARK_DETECTION",
            maxResults: 10,
          },
          {
            type: "WEB_DETECTION",
            maxResults: 5,
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(url, body);

    const { responses } = response.data;
    if (responses && responses.length > 0) {
      const landmarkAnnotations = responses[0]?.landmarkAnnotations || [];

      if (landmarkAnnotations.length > 0) {
        const sortedLandmarks = landmarkAnnotations.sort(
          (a, b) => b.score - a.score
        );

        const topLandmark = sortedLandmarks[0];

        setTitle(topLandmark.description);

        const description = await fetchDescriptionFromWikipedia(
          topLandmark.description
        );
        setDetails(description);
      } else {
        const webDetection = responses[0]?.webDetection || {};
        if (webDetection.webEntities && webDetection.webEntities.length > 0) {
          const sortedWebEntities = webDetection.webEntities.sort(
            (a, b) => b.score - a.score
          );

          const topEntity = sortedWebEntities[0];
          const description = await fetchDescriptionFromWikipedia(
            topEntity.description
          );
          setTitle(topEntity.description);
          setDetails(description);
        } else {
          setDetails("No landmarks or relevant web entities detected.");
        }
      }
    } else {
      setDetails("No response received or response format is incorrect.");
    }
  } catch (error) {
    console.error(
      "Error analyzing image:",
      error.response ? error.response.data : error.message
    );
    setDetails("Error fetching details.");
  } finally {
    setLoading(false);
  }
};
