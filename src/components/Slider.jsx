import React, { useState } from 'react';
import { X } from 'lucide-react';

export const Slider = ({ images }) => {
    const [imageIdx, setImageIdx] = useState(null);

    const changeSlide = (direction) => {
        if (direction === 'left') {
            if (imageIdx === 0) {
                setImageIdx(images.length - 1);
            } else {
                setImageIdx((prev) => prev - 1);
            }
        } else if (direction === 'right') {
            if (imageIdx === images.length - 1) {
                setImageIdx(0);
            } else {
                setImageIdx((prev) => prev + 1);
            }
        }
    };

    return (
        <div className="flex h-[400px] w-full gap-5">
            {imageIdx !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-between bg-black/95">
                    <div
                        className="flex flex-[1] cursor-pointer items-center justify-center"
                        onClick={() => changeSlide('left')}
                    >
                        <img src={'/arrow.png'} className="w-[50px]"></img>
                    </div>
                    <div className="h-[95%] flex-[10]">
                        <img
                            src={images[imageIdx]}
                            className="h-full w-full rounded-md object-cover"
                        ></img>
                    </div>
                    <div
                        className="flex flex-[1] cursor-pointer items-center justify-center"
                        onClick={() => changeSlide('right')}
                    >
                        <img
                            src={'/arrow.png'}
                            className="w-[50px] rotate-180"
                        ></img>
                    </div>
                    <div
                        className="absolute top-5 right-5 cursor-pointer font-bold text-white"
                        onClick={() => setImageIdx(null)}
                    >
                        <X strokeWidth={3} size={40} />
                    </div>
                </div>
            )}

            <div className="flex-[3]">
                <img
                    src={images[0]}
                    className="h-full w-full cursor-pointer rounded-md object-cover"
                    onClick={() => setImageIdx(0)}
                ></img>
            </div>
            <div className="flex flex-[1] flex-col justify-between gap-5">
                {images.slice(1).map((image, index) => (
                    <img
                        src={image}
                        key={index}
                        className="h-[120px] w-full cursor-pointer rounded-md object-cover"
                        onClick={() => {
                            setImageIdx(index + 1);
                        }}
                    ></img>
                ))}
            </div>
        </div>
    );
};
