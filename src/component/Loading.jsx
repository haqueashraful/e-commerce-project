"use client";

import Image from "next/image";
import loading from "../assets/images/loading.gif"

const Loading = () => {
    return (
        <div>
            <div className="loader">
               <Image src={loading} />
            </div>
        </div>
    );
};

export default Loading;