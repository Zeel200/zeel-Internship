import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("https://us-central1-nft-cloud-functions.cloudfunctions.net/explore");
        const data = await response.json();
        setItems(
          data.map((item) => ({
            ...item,
            timer: item.timer - Math.floor(Date.now() / 1000), // Calculate initial remaining time
          }))
        );
      } catch (error) {
        console.error("Error fetching explore items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prevItems) =>
        prevItems.map((item) => {
          const remainingTime = Math.max(item.timer - 1, 0);
          return { ...item, timer: remainingTime };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [items]);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const SkeletonItem = () => (
    <div
      className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 skeleton-item"
      style={{ display: "block" }}
    >
      <div className="nft__item skeleton">
        <div className="author_list_pp">
          <div className="skeleton-box" style={{ width: 50, height: 50, borderRadius: "50%" }}></div>
        </div>
        <div className="nft__item_wrap">
          <div className="skeleton-box" style={{ width: "100%", height: 150 }}></div>
        </div>
        <div className="nft__item_info">
          <div className="skeleton-box" style={{ width: "60%", height: 20, marginBottom: 10 }}></div>
          <div className="skeleton-box" style={{ width: "40%", height: 20 }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div>
        <select id="filter-items" defaultValue="">
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      <div className="row">
        {loading
          ? new Array(8).fill(0).map((_, index) => <SkeletonItem key={index} />)
          : items.map((item, index) => (
              <div
                key={index}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                style={{ display: "block" }}
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link
                      to={`/author/${item.authorId}`}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                    >
                      <img
                        className="lazy"
                        src={item.authorImage}
                        alt={item.authorName}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  <div className="de_countdown">{formatTime(item.timer)}</div>

                  <div className="nft__item_wrap">
                    <div className="nft__item_extra">
                      <div className="nft__item_buttons">
                        <button>Buy Now</button>
                        <div className="nft__item_share">
                          <h4>Share</h4>
                          <a href="" target="_blank" rel="noreferrer">
                            <i className="fa fa-facebook fa-lg"></i>
                          </a>
                          <a href="" target="_blank" rel="noreferrer">
                            <i className="fa fa-twitter fa-lg"></i>
                          </a>
                          <a href="">
                            <i className="fa fa-envelope fa-lg"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <Link to={`/item-details/${item.id}`}>
                      <img
                        src={item.nftImage}
                        className="lazy nft__item_preview"
                        alt={item.title}
                      />
                    </Link>
                  </div>
                  <div className="nft__item_info">
                    <Link to={`/item-details/${item.id}`}>
                      <h4>{item.title}</h4>
                    </Link>
                    <div className="nft__item_price">{item.price} ETH</div>
                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
      <div className="col-md-12 text-center">
        <Link to="" id="loadmore" className="btn-main lead">
          Load more
        </Link>
      </div>
    </>
  );
};

export default ExploreItems;