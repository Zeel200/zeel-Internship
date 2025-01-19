import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const NewItems = () => {
  const [newItems, setNewItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewItems = async () => {
      try {
        const response = await fetch(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );
        const data = await response.json();

        // Initialize countdown timers
        const updatedItems = data.map((item) => ({
          ...item,
          countdown: item.countdown, // Use countdown value from API
        }));

        setNewItems(updatedItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching new items:", error);
        setLoading(false);
      }
    };

    fetchNewItems();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setInterval(() => {
        setNewItems((prevItems) =>
          prevItems.map((item) => ({
            ...item,
            countdown: Math.max(item.countdown - 1, 0), // Countdown decrement
          }))
        );
      }, 1000);

      return () => clearInterval(timer); // Cleanup timer on unmount
    }
  }, [loading]);

  const formatCountdown = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          {loading ? (
            new Array(4).fill(0).map((_, index) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                <div className="nft__item">
                  {/* Author Skeleton */}
                  <div className="author_list_pp">
                    <Skeleton
                      circle={true}
                      height={50}
                      width={50}
                      style={{ marginBottom: "10px" }}
                    />
                  </div>
                  {/* Countdown Skeleton */}
                  <div className="de_countdown">
                    <Skeleton width="80%" />
                  </div>
                  {/* Item Image Skeleton */}
                  <div className="nft__item_wrap">
                    <Skeleton height={200} />
                  </div>
                  {/* Info Skeleton */}
                  <div className="nft__item_info">
                    <Skeleton width="60%" />
                    <Skeleton width="40%" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            newItems.map((item, index) => (
              <div
                className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                key={item.id || index}
              >
                <div className="nft__item">
                  {/* Author */}
                  <div className="author_list_pp">
                    <Link
                      to={`/author/${item.authorId}`}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={`Creator: ${item.authorName}`}
                    >
                      <img
                        className="lazy"
                        src={item.authorImage}
                        alt={item.authorName}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  {/* Countdown */}
                  <div className="de_countdown">
                    {item.countdown > 0
                      ? formatCountdown(item.countdown)
                      : "Ended"}
                  </div>
                  {/* Item Image */}
                  <div className="nft__item_wrap">
                    <Link to={`/item-details/${item.id}`}>
                      <img
                        src={item.nftImage}
                        className="lazy nft__item_preview"
                        alt={item.name}
                      />
                    </Link>
                  </div>
                  {/* Info */}
                  <div className="nft__item_info">
                    <Link to={`/item-details/${item.id}`}>
                      <h4>{item.name}</h4>
                    </Link>
                    <div className="nft__item_price">{item.price} ETH</div>
                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;
