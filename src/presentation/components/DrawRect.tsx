import React, { useState } from "react";
import useImage from "use-image";
import { Stage, Layer, Rect, Image } from "react-konva";

type myProps = {
  imageSrc: any;
  getCoordinates: any;
};
const DrawRect: React.FC<myProps> = ({ imageSrc, getCoordinates }) => {
  const [annotations, setAnnotations] = useState<any>([]);
  const [newAnnotation, setNewAnnotation] = useState<any>([]);

    const [image] = useImage(imageSrc, "anonymous");
  const handleMouseDown = (event: {
    target: {
      getStage: () => {
        (): any;
        new (): any;
        getPointerPosition: { (): { x: any; y: any }; new (): any };
      };
    };
  }) => {
    if (newAnnotation.length === 0) {
      const { x, y } = event.target.getStage().getPointerPosition();
      setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }]);
    }
  };

  const handleMouseUp = (event: {
    target: {
      getStage: () => {
        (): any;
        new (): any;
        getPointerPosition: { (): { x: any; y: any }; new (): any };
      };
    };
  }) => {
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      const annotationToAdd: any = {
        x: sx,
        y: sy,
        width: x - sx,
        height: y - sy,
        key: annotations.length + 1,
        image: imageSrc
      };
      annotations.push(annotationToAdd);
      setNewAnnotation([]);
      setAnnotations(annotations);
      getCoordinates(annotationToAdd, imageSrc)
    }
  };
  const handleMouseMove = (event: {
    target: {
      getStage: () => {
        (): any;
        new (): any;
        getPointerPosition: { (): { x: any; y: any }; new (): any };
      };
    };
  }) => {
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      setNewAnnotation([
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          key: 0,
        },
      ]);
    }
  };
 
  const annotationsToDraw = [...annotations, ...newAnnotation];
  return (
    <>
    {/* <fieldset style={{borderRadius: '10px', marginBottom: 10, display: 'flex'}}> */}
    <div style={{border: 'solid 2px #888', padding: 5,}}>
      <Stage
        onMouseDown={(e: any) => handleMouseDown(e)}
        onMouseUp={(e: any) => handleMouseUp(e)}
        onMouseMove={(e: any) => handleMouseMove(e)}
        width={900}
        height={700}
      >
            <Layer>
            <Image
              image={image}
              alt="image"
              draggable={false}
              width={900}
              height={700}
            />
          {annotationsToDraw.map((value) => {
            return (
              <Rect
                x={value.x}
                y={value.y}
                width={value.width}
                height={value.height}
                fill="black"
                stroke="black"
              />
            );
          })}
        </Layer>
        
       
      </Stage>
    </div>
    {/* </fieldset> */}
    </>
  );
};

export default DrawRect;
