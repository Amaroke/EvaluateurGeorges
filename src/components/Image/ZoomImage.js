import React from "react";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import RandomImage from "./RandomImage";

const ZoomImage = () => {
    return (
        <>
            <div>
                <TransformWrapper
                    defaultScale={1}
                    defaultPositionX={1}
                    defaultPositionY={1}
                >
                    <TransformComponent>
                        <RandomImage style={{width: "100%"}}/>
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </>
    );
};

export default ZoomImage;