import React from 'react';

const Spinner: React.FC = () => {
    return (
            <div className="">
                {[...Array(15)].map((_, index) => (
                    <div
                        key={index}
                        className={`w-[3%] h-[28%] absolute top-[35.5%] left-[48.5%] opacity-0 rounded-sm animate-fade dark:bg-white bg-black box-shadow-md`}
                        style={{
                            transform: `rotate(${(index * -24)}deg) translate(0, -130%)`,
                            animationDelay: `-${index * 0.03333}s`,
                        }}
                    />
                ))}
            </div>
    );
};

export default Spinner;
