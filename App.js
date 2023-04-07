import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./App.css";

const SocialMediaAggregator = () => {
  const [linkedinData, setLinkedinData] = useState([]);
  const [facebookData, setFacebookData] = useState([]);
  const [instagramData, setInstagramData] = useState({});
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const linkedinResponse = await fetch(
        "https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))"
      );
      const linkedinJson = await linkedinResponse.json();
      const linkedinData = {
        id: linkedinJson.id,
        title: `${linkedinJson.firstName} ${linkedinJson.lastName}`,
        description: linkedinJson.profilePicture["displayImage~"].elements[0]
          .identifiers[0].identifier,
      };
      setLinkedinData([linkedinData]);

      const facebookResponse = await fetch(
        "https://graph.facebook.com/v13.0/me/feed?fields=id,message,description&access_token=<YOUR_FACEBOOK_ACCESS_TOKEN>"
      );
      const facebookJson = await facebookResponse.json();
      setFacebookData(facebookJson.data);

      const instagramResponse = await fetch(
        "https://graph.instagram.com/me/media?fields=id,caption,media_url&access_token=<YOUR_INSTAGRAM_ACCESS_TOKEN>"
      );
      const instagramJson = await instagramResponse.json();
      setInstagramData(instagramJson);
    } catch (error) {
      console.log(error);
    }
  };

  const renderFeedItem = (item) => {
    if (item.service === "linkedin") {
      return (
        <div key={item.id} className="feed-item">
          <h2>{item.title}</h2>
          <img src={item.description} alt={item.title} />
        </div>
      );
    } else if (item.service === "facebook") {
      return (
        <div key={item.id} className="feed-item">
          <p>{item.message}</p>
          <p>{item.description}</p>
        </div>
      );
    } else {
      return (
        <div key={item.id} className="feed-item">
          <img src={item.media_url} alt={item.caption} />
          <p>{item.caption}</p>
        </div>
      );
    }
  };

  const combinedData = [
    ...linkedinData.map((item) => ({
      id: item.id,
      service: "linkedin",
      title: item.title,
      description: item.description,
    })),
    ...facebookData.map((item) => ({
      id: item.id,
      service: "facebook",
      message: item.message,
      description: item.description,
    })),
    ...instagramData.data.map((item) => ({
      id: item.id,
      service: "instagram",
      media_url: item.media_url,
      caption: item.caption,
    })),
  ];

  return (
    <div className="feed-container">
      <InfiniteScroll
        dataLength={combinedData.length}
        next={fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>You have reached the end!</p>}
      >
        {combinedData.map((item) => renderFeedItem(item))}
      </InfiniteScroll>
    </div>
  );
};

export default SocialMediaAggregator;
      </InfiniteScroll>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Socialize.io</h1>
      </header>
      <SocialMediaAggregator />
    </div>
  );
}

export default App;
