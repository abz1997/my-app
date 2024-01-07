import React, { useState, useRef, useEffect } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect, Transformer, Image } from 'react-konva';
import myImage2 from './images/middle-cropped.png';
import blackTshirtImage from './images/plainblacktshirt.png';
import whiteTshirtImage from './images/plainwhitetshirt.png';

const TshirtEditor = ({ selectedColour }) => {
    const [image, setImage] = useState(new window.Image());
    const [tshirtImage, setTshirtImage] = useState(new window.Image());
    const [scaledImageSize, setScaledImageSize] = useState({ width: 0, height: 0 });
    const [squareSize, setSquareSize] = useState({ width: 135, height: 240 });
    const imageRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({ width: 340, height: 340 });
    const stageRef = useRef(null);
    const transformerRef = useRef(null);
    const selectionRectangleRef = useRef(null);
    const initialImageState = useRef({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });

    tshirtImage.src = selectedColour === 'Black' ? blackTshirtImage : whiteTshirtImage;

    const img = new window.Image();
    img.src = myImage2;
    const initialWidth = squareSize.width / img.naturalWidth;
    const initialHeight = squareSize.height / img.naturalHeight;
    const scale1 = Math.min(initialWidth, initialHeight);
    const scaledWidth1 = img.naturalWidth * scale1;
    const scaledHeight1 = img.naturalHeight * scale1;


    useEffect(() => {

        img.onload = () => {
            const scaleWidth = squareSize.width / img.naturalWidth;
            const scaleHeight = squareSize.height / img.naturalHeight;
            const scale = Math.min(scaleWidth, scaleHeight);

            const scaledWidth = img.naturalWidth * scale;
            const scaledHeight = img.naturalHeight * scale;
            const imageX = (canvasSize.width - scaledWidth) / 2;
            const imageY = (canvasSize.height - scaledHeight) / 2;

            setImage(img);

            initialImageState.current = {
                x: imageX,
                y: imageY,
                width: scaledWidth,
                height: scaledHeight,
            };

            console.log("Start:", initialImageState.current);

            setScaledImageSize({ width: scaledWidth, height: scaledHeight });

            if (imageRef.current) {
                imageRef.current.position({ x: imageX, y: imageY });
                imageRef.current.size({ width: scaledWidth, height: scaledHeight });
                imageRef.current.getLayer().batchDraw();
            }
        };
    }, [squareSize.width, squareSize.height, canvasSize.width, canvasSize.height, selectedColour]);

    useEffect(() => {
      // Load and set t-shirt image based on selected color
      const tshirtImg = new window.Image();
      tshirtImg.src = selectedColour === 'Black' ? blackTshirtImage : whiteTshirtImage;
      tshirtImg.onload = () => {
          setTshirtImage(tshirtImg);
      };
  }, [selectedColour]);
  let selecting = false;
  let x1, y1, x2, y2;

const resetImage = () => {
  if (imageRef.current) {
    const { x, y, width, height } = initialImageState.current;
    imageRef.current.position({ x, y });
    imageRef.current.size({width: scaledWidth1, height: scaledHeight1});
    imageRef.current.rotation(0);
    setScaledImageSize({width: scaledWidth1, height: scaledHeight1});
imageRef.current.getLayer().batchDraw();
  }
};


  useEffect(() => {
    const transformer = transformerRef.current;
    const selectionRectangle = selectionRectangleRef.current;
    const stage = stageRef.current;

    transformer.nodes([]);

    stage.on('mousedown touchstart', (e) => {
      if (e.target !== stage) {
        return;
      }
      e.evt.preventDefault();
      x1 = stage.getPointerPosition().x;
      y1 = stage.getPointerPosition().y;
      x2 = x1;
      y2 = y1;

      selectionRectangle.width(0);
      selectionRectangle.height(0);
      selectionRectangle.visible(true);
      selecting = true;
    });

    stage.on('mousemove touchmove', (e) => {
      if (!selecting) {
        return;
      }
      e.evt.preventDefault();
      x2 = stage.getPointerPosition().x;
      y2 = stage.getPointerPosition().y;

      selectionRectangle.setAttrs({
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
      });
    });

    stage.on('mouseup touchend', (e) => {
      selecting = false;
      if (!selectionRectangle.visible()) {
        return;
      }
      e.evt.preventDefault();
      selectionRectangle.visible(false);

      const shapes = stage.find('.rect');
      const box = selectionRectangle.getClientRect();
      const selected = shapes.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      );
      transformer.nodes(selected);
    });

    stage.on('click tap', function (e) {
      if (selectionRectangle.visible()) {
        return;
      }

      if (e.target === stage) {
        transformer.nodes([]);
        return;
      }

      if (!e.target.hasName('rect')) {
        return;
      }

      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = transformer.nodes().indexOf(e.target) >= 0;

      if (!metaPressed && !isSelected) {
        transformer.nodes([e.target]);
      } else if (metaPressed && isSelected) {
        const nodes = transformer.nodes().slice();
        nodes.splice(nodes.indexOf(e.target), 1);
        transformer.nodes(nodes);
      } else if (metaPressed && !isSelected) {
        const nodes = transformer.nodes().concat([e.target]);
        transformer.nodes(nodes);
      }
    });
  }, []);

  const imageX = (canvasSize.width - squareSize.width) / 2 + (squareSize.width - scaledImageSize.width) / 2;
    const imageY = (canvasSize.height - squareSize.height) / 2 + (squareSize.height - scaledImageSize.height) / 2;

    return (
        <div>
        <button onClick={resetImage}>Reset Image</button>
        <div style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px`, margin: '0 auto', border: '2px solid black', position: 'relative', borderRadius: '15px' }}>
          <Stage ref={stageRef} width={canvasSize.width} height={canvasSize.height}>
            <Layer>
              <Image
                      image={tshirtImage}
                      width={canvasSize.width}
                      height={canvasSize.height}
                  />
                  <Image
                      ref={imageRef}
                      x={imageX}
                      y={imageY}
                      width={scaledImageSize.width}
                      height={scaledImageSize.height}
                      image={image}
                      draggable
                      name='rect'
                  />
                  <Transformer ref={transformerRef} />
                  <Rect
                      ref={selectionRectangleRef}
                      fill='rgba(0,0,255,0.5)'
                      visible={false}
                      keepRatio={true}
                  />
              </Layer>
          </Stage>
          </div>
      </div>
  );
};

export default TshirtEditor;