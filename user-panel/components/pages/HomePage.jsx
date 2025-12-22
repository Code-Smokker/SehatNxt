"use client";

import React from "react";
// import Navbar from "@/components/shared/Navbar"; // Handled in layout
import Hero from "@/components/shared/Hero";
import Categories from "@/components/shared/Categories";
import OfferSlider from "@/components/sliders/OfferSlider";
import NearestDoctors from "@/components/shared/NearestDoctors";
// import FeedbackSlider from '../shared/FeedbackSlider';
import Footer from "@/components/shared/Footer";
import { useTokenSystem } from "@/hooks/useTokenSystem";

const HomePage = () => {
    // const { location } = useUserLocation(); // Navbar handles this or passed down
    const tokenData = useTokenSystem();

    return (
        <div className="bg-slate-50 pb-0">

            <Hero />
            <Categories />


            {/* --- Unified Slider Section --- */}
            <OfferSlider />

            {/* --- Nearest Doctors Section --- */}
            <NearestDoctors />

            {/* 6. Patient Feedback - REMOVED */}
            {/* <FeedbackSlider /> */}

            {/* --- Footer --- */}
            <Footer />
        </div>
    );
};

export default HomePage;
