import React, { useState } from "react";
import useImage from "use-image";
import { Stage, Layer, Rect, Image } from "react-konva";
import { Button } from "@mui/material";

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
        image: imageSrc,
      };
      annotations.push(annotationToAdd);
      setNewAnnotation([]);
      setAnnotations(annotations);
      getCoordinates(annotationToAdd, imageSrc);
    }
  };
  function reset() {
    setAnnotations([])
    getCoordinates(null,imageSrc)

  }
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
      <div style={{ border: "solid 2px #888", padding: 5,width:"500px",marginLeft:"30%",marginBottom:"5%" }}>
        <Stage
          onMouseDown={(e: any) => handleMouseDown(e)}
          onMouseUp={(e: any) => handleMouseUp(e)}
          onMouseMove={(e: any) => handleMouseMove(e)}
          width={500}
          height={500}
        >
          <Layer>
            <Image
              image={image}
              alt="image"
              draggable={false}
              width={500}
              height={500}
              
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
        <Button onClick={()=>reset()} variant="outlined" sx={{margin: 2}}>Reset</Button>
      </div>
    </>
  );
};

export default DrawRect;
