import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const AuthorItems = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [products, setProducts] = useState([]);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await fetch(`https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=73855012`);
        const data = await response.json();
        setAuthor(data);
        setFollowers(data.followers);
      } catch (error) {
        console.error("Error fetching author data:", error);
      }
    };

    const fetchAuthorProducts = async () => {
      try {
        const response = await fetch(`https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=73855012/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching author products:", error);
      }
    };

    fetchAuthorData();
    fetchAuthorProducts();
  }, [authorId]);

  const handleFollow = () => {
    setFollowers((prev) => prev + 1);
  };

  if (!author) return <p>Loading author details...</p>;

  return (
    <div className="author-details">
      <div className="author-info">
        <img src={author.image} alt={author.name} className="author-image" />
        <h2>{author.name}</h2>
      </div>
      <div className="de_tab_content">
        <div className="tab-1">
          <div className="row">
            {products.map((product) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={product.id}>
                <div className="nft__item">
                  <div className="nft__item_wrap">
                    <Link to={`/item-details/${product.id}`}>
                      <img src={product.image} className="lazy nft__item_preview" alt={product.name} />
                    </Link>
                  </div>
                  <div className="nft__item_info">
                    <Link to={`/item-details/${product.id}`}>
                      <h4>{product.name}</h4>
                    </Link>
                    <div className="nft__item_price">{product.price} ETH</div>
                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{product.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;
