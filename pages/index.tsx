import { dir, log } from "console";
import { useEffect, useState } from "react";
import useInterval from "use-interval";
import { useRouter } from "next/router";
import { AiOutlineArrowUp } from "react-icons/ai";
import { AiOutlineArrowDown } from "react-icons/ai";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiOutlineArrowRight } from "react-icons/ai";
import Stopwatch from "./stopwatch";
// import image from "./assets/download.png";

const zoom = 20;
const areaWidth = 40;
const areaHeight = 30;

export default function Home() {
  const [body, setBody] = useState([
    { top: 3, left: 5 },
    { top: 3, left: 4 },
    { top: 3, left: 3 },
  ]);
  const [direction, setDirection] = useState("down");

  const [food, setFood] = useState({ top: 5, left: 5 });

  const [point, setPoint] = useState(0);
  const router = useRouter();
  const handleRefresh = () => {
    router.reload();
  };

  function Gameover() {
    for (let i = 1; i < body.length; i++) {
      if (body[i].top == body[0].top && body[i].left == body[0].left) {
        alert("Game over");

        handleRefresh();
      }
    }
  }

  useEffect(() => {
    generateFood();

    window.addEventListener("keydown", (e) => {
      setDirection((prevDirection) => {
        switch (e.code) {
          case "ArrowDown":
            if (prevDirection !== "up") {
              return "down";
            }
            break;
          case "ArrowRight":
            if (prevDirection !== "left") {
              return "right";
            }
            break;
          case "ArrowUp":
            if (prevDirection !== "down") {
              return "up";
            }
            break;
          case "ArrowLeft":
            if (prevDirection !== "right") {
              return "left";
            }
            break;
        }
        return prevDirection;
      });
    });
  }, []);

  function addPoint() {
    setPoint(point + 2);
  }

  function generateFood() {
    const top = Math.floor(Math.random() * areaHeight);
    const left = Math.floor(Math.random() * areaWidth);
    setFood({ top, left });
  }
  function goRight() {
    const newBody = [...body];

    newBody.pop();

    let newLeft = newBody[0].left + 1;
    if (newLeft > areaWidth - 1) {
      newLeft = 0;
    }

    newBody.unshift({ ...newBody[0], left: newLeft });

    setBody(newBody);
  }

  function goDown() {
    const newBody = [...body];

    newBody.pop();

    let newTop = newBody[0].top + 1;
    if (newTop > areaHeight - 1) {
      newTop = 0;
    }

    newBody.unshift({ ...newBody[0], top: newTop });

    setBody(newBody);
  }
  function goUp() {
    const newBody = [...body];

    newBody.pop();

    let newTop = newBody[0].top - 1;
    if (newTop < 0) {
      newTop = areaHeight - 1;
    }

    newBody.unshift({ ...newBody[0], top: newTop });

    setBody(newBody);
  }
  function goLeft() {
    const newBody = [...body];

    newBody.pop();

    let newLeft = newBody[0].left - 1;
    if (newLeft < 0) {
      newLeft = areaWidth - 1;
    }

    newBody.unshift({ ...newBody[0], left: newLeft });

    setBody(newBody);
  }

  useInterval(() => {
    switch (direction) {
      case "right":
        goRight();
        break;
      case "down":
        goDown();

        break;

      case "up":
        goUp();

        break;

      case "left":
        goLeft();

        break;
    }

    // check food is consumed
    if (body[0].top === food.top && body[0].left === food.left) {
      generateFood(); // generate new food
      if (direction == "up") {
        setBody([...body, { top: body[0].top + 1, left: body[0].left }]); //grow snake
        addPoint();
      }
      if (direction == "down") {
        setBody([...body, { top: body[0].top - 1, left: body[0].left }]); //grow snake
        addPoint();
      }
      if (direction == "right") {
        setBody([...body, { top: body[0].top, left: body[0].left + 1 }]); //grow snake
        addPoint();
      }
      if (direction == "left") {
        setBody([...body, { top: body[0].top, left: body[0].left - 1 }]); //grow snake
        addPoint();
      }
    }
    Gameover();
  }, 200);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
      style={{
        backgroundImage:
          "url(" +
          "https://snakearcade.netlify.app/static/media/oldMonitor.52c8438b.png" +
          ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 100,
        }}
      >
        Your points: {point}
      </div>
      <Stopwatch />
      <div>
        <div
          className="relative bg-slate-300"
          style={{
            width: areaWidth * zoom,
            height: areaHeight * zoom,
            position: "absolute",
            backgroundColor: "black",
            top: 150,
            left: 700,
            borderRadius: 10,
          }}
        >
          <div
            className="absolute rounded"
            style={{
              top: food.top * zoom,
              left: food.left * zoom,
              width: zoom,
              height: zoom,
              backgroundImage: `url(/download.png)`,
              backgroundSize: "cover",
            }}
          ></div>

          {body.map((segment) => (
            <div
              className="absolute rounded bg-slate-900"
              style={{
                top: segment.top * zoom,
                left: segment.left * zoom,
                width: zoom,
                height: zoom,
                backgroundColor: "green",
              }}
            ></div>
          ))}
        </div>
        <button onClick={handleRefresh}>Refresh</button>
        <div
          style={{
            display: "flex",
            gap: 0,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 20,
            right: 40,
          }}
        >
          <div
            onClick={() => setDirection("up")}
            style={{
              width: 100,
              height: 100,
              borderWidth: 2,
              fontSize: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AiOutlineArrowUp />
          </div>

          <div style={{ display: "flex" }}>
            <div
              onClick={() => setDirection("left")}
              style={{
                width: 100,
                height: 100,
                fontSize: 40,
                borderWidth: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AiOutlineArrowLeft />
            </div>
            <div
              onClick={() => setDirection("down")}
              style={{
                width: 100,
                height: 100,
                fontSize: 40,
                borderWidth: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AiOutlineArrowDown />
            </div>
            <div
              onClick={() => setDirection("right")}
              style={{
                width: 100,
                height: 100,
                fontSize: 40,
                borderWidth: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AiOutlineArrowRight />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
