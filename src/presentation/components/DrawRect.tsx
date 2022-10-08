import React, { useState } from "react";
import useImage from "use-image";
import { Stage, Layer, Rect, Image } from "react-konva";
import { Typography } from "@mui/material";

type myProps = {
  imageSrc: any;
  getCoordinates: any;
};
const DrawRect: React.FC<myProps> = ({ imageSrc, getCoordinates }) => {
// console.log(imageSrc, 'imagerc')
  const [annotations, setAnnotations] = useState<any>([]);
  const [newAnnotation, setNewAnnotation] = useState<any>([]);
  const [isChecked, setIsChecked] = useState<any[]>([]);

  // for(let i = 0; i<imageSrc.length; i++){
    const [image] = useImage(imageSrc, "anonymous");
  // }
// console.log(image);
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
  const handleCheckBox = (e?:any)=>{
    if(e){
      setIsChecked(isChecked.concat(true));
    }
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
    <Typography sx={{fontWeight: 'bold', margin: 2}}>Select the checkbox before manually manipulate the image</Typography>
    <fieldset style={{borderRadius: '10px', marginBottom: 10, display: 'flex'}}>
    {/* <input type="checkbox" onChange={(e)=>handleCheckBox(e.target.checked)} id="checkbox"/> */}
    <div style={{width: '100%', marginBottom: '-18%', marginLeft: '14%'}}>
      <Stage
        onMouseDown={(e: any) => handleMouseDown(e)}
        onMouseUp={(e: any) => handleMouseUp(e)}
        onMouseMove={(e: any) => handleMouseMove(e)}
        width={700}
        height={500}
      >
            <Layer>
            <Image
              image={image}
              alt="image"
              draggable={false}
            />
          {annotationsToDraw.map((value) => {
              // console.log(value, 's')
            return (
              <Rect
                x={value.x}
                y={value.y}
                width={value.width}
                height={value.height}
                fill="black"
                stroke="black"
                // key={value.key}
              />
            );
          })}
        </Layer>
        
       
      </Stage>
    </div>
    </fieldset>
    </>
  );
};

export default DrawRect;
