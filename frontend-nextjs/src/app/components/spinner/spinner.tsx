import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="">
            {[...Array(15)].map((_, index) => (
                <div
                    key={index}
                    className={`w-[4%] h-[28%] absolute top-[35.5%] left-[48.5%] opacity-0 rounded-sm animate-fade dark:bg-white bg-black box-shadow-md`}
                    style={{
                        transform: `rotate(${(index * -24)}deg) translate(0, -130%)`,
                        animationDelay: `-${index * 0.03333}s`,
                    }}
                />
            ))}
        </div>
    );
};

export const FullScreenSpinner = () => {
    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen min-h-[calc(100vh)] flex justify-center items-center backdrop-brightness-50 z-50">
            <div className="absolute w-10 h-10 scale-100">
                <Spinner />
            </div>
            <div className="relative top-9">
            </div>
        </div>
    );
}

export default Spinner;
