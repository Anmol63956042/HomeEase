import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/frontend_assets/assets";

const AppDownload = () => {
  return (
    <section className="app-download" id="app-download">
      <h2 className="app-download-title">
        For a Better Experience, Download <br /> Homease App
      </h2>
      <div className="app-download-platform">
        <a
          href="https://play.google.com/store/apps/details?id=your.app.id"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={assets.play_store} alt="Download Homease App on Google Play" />
        </a>
        <a
          href="https://apps.apple.com/app/idyourappid"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={assets.app_store} alt="Download Homease App on Apple App Store" />
        </a>
      </div>
    </section>
  );
};

export default AppDownload;
