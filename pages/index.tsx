import { dir, log } from "console";
import { useEffect, useState } from "react";
import useInterval from "use-interval";
import { useRouter } from "next/router";
import { AiOutlineArrowUp } from "react-icons/ai";
import { AiOutlineArrowDown } from "react-icons/ai";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiOutlineArrowRight } from "react-icons/ai";
import Stopwatch from "./stopwatch";
// import useSound from "use-sound";
// import beep from "./assets/jumping.mp3";

// import image from "./assets/download.png";

const zoom = 20;
const areaWidth = 40;
const areaHeight = 30;
const image = `url(/download.png)`;

const points: string[] = [];
for (let i = 0; i < areaWidth; i++) {
  for (let j = 0; j < areaHeight; j++) {
    points.push(`${i}-${j}`);
  }
}

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
              // Beep();
              return "down";
            }
            break;
          case "ArrowRight":
            if (prevDirection !== "left") {
              // beep();
              return "right";
            }
            break;
          case "ArrowUp":
            if (prevDirection !== "down") {
              // beep();
              return "up";
            }
            break;
          case "ArrowLeft":
            if (prevDirection !== "right") {
              // beep();
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

  // const Beep = () => {
  //   const [play] = useSound(beep);
  // };

  // function eat() {
  //   var sound = new Audio(
  //     "https://s19.aconvert.com/convert/p3r68-cdx67/pw4mh-0vojn.mp3"
  //   );
  //   sound.play();
  // }

  function generateFood() {
    let pointsWithoutBody = [...points];
    for (let i = 0; i < body.length; i++) {
      const bodyPartString = `${body[i].left}-${body[i].top}`;
      pointsWithoutBody = pointsWithoutBody.filter(
        (string) => string !== bodyPartString
      );
    }

    const randomIndexBetweenPoints = Math.floor(
      Math.random() * pointsWithoutBody.length
    );
    const pointString = pointsWithoutBody[randomIndexBetweenPoints];
    const [leftString, topString] = pointString.split("-");
    setFood({ top: Number(topString), left: Number(leftString) });
  }
  function goRight() {
    let newLeft = body[0].left + 1;
    if (newLeft > areaWidth - 1) {
      newLeft = 0;
    }

    return { ...body[0], left: newLeft };
  }

  function goDown() {
    let newTop = body[0].top + 1;
    if (newTop > areaHeight - 1) {
      newTop = 0;
    }

    return { ...body[0], top: newTop };
  }

  function goUp() {
    let newTop = body[0].top - 1;
    if (newTop < 0) {
      newTop = areaHeight - 1;
    }

    return { ...body[0], top: newTop };
  }

  function goLeft() {
    let newLeft = body[0].left - 1;
    if (newLeft < 0) {
      newLeft = areaWidth - 1;
    }

    return { ...body[0], left: newLeft };
  }

  useInterval(() => {
    const newBody = [...body];
    newBody.pop();

    let newHead = null;
    switch (direction) {
      case "right":
        newHead = goRight();
        break;
      case "down":
        newHead = goDown();

        break;

      case "up":
        newHead = goUp();

        break;

      case "left":
        newHead = goLeft();

        break;
      default:
        newHead = goRight();
    }

    newBody.unshift(newHead);

    // check food is consumed

    const isFoodConsumedBySnake =
      newBody[0].top === food.top && newBody[0].left === food.left;
    if (isFoodConsumedBySnake) {
      generateFood();

      if (direction == "up") {
        setBody([...body, { top: body[0].top + 1, left: body[0].left }]); //grow snake
        addPoint();
        // eat();
      }
      if (direction == "down") {
        setBody([...body, { top: body[0].top - 1, left: body[0].left }]); //grow snake
        addPoint();
        // eat();
      }
      if (direction == "right") {
        setBody([...body, { top: body[0].top, left: body[0].left + 1 }]); //grow snake
        addPoint();
        // eat();
      }
      if (direction == "left") {
        setBody([...body, { top: body[0].top, left: body[0].left - 1 }]); //grow snake
        addPoint();
        // eat();
      }
    } else {
      setBody(newBody);
    }
    Gameover();
  }, 100);

  if (!image)
    return (
      <>
        <div>loading...</div>
      </>
    );
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
          fontSize: 50,
          fontWeight: "bolder",
          padding: 30,
          borderRadius: 5,
          border: "1px ",
          boxShadow: "20px 20px 100px rgba(0, 0, 0, 0.3)",
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
              width: zoom + 5,
              height: zoom + 5,
              backgroundImage: image,

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
        <button
          onClick={handleRefresh}
          style={{
            fontSize: 20,
            position: "absolute",
            bottom: 200,
            right: 835,
            height: 80,
          }}
        >
          Refresh
        </button>
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
