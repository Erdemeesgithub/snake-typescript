import { log } from "console";
import { useEffect, useState } from "react";
import useInterval from "use-interval";
import { useRouter } from "next/router";

const zoom = 20;
const areaWidth = 30;
const areaHeight = 30;

export default function Home() {
  const [body, setBody] = useState([
    { top: 3, left: 5 },
    { top: 3, left: 4 },
    { top: 3, left: 3 },
  ]);
  const [direction, setDirection] = useState("down");

  const [food, setFood] = useState({ top: 5, left: 5 });
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
      }
      if (direction == "down") {
        setBody([...body, { top: body[0].top - 1, left: body[0].left }]); //grow snake
      }
      if (direction == "right") {
        setBody([...body, { top: body[0].top, left: body[0].left + 1 }]); //grow snake
      }
      if (direction == "left") {
        setBody([...body, { top: body[0].top, left: body[0].left - 1 }]); //grow snake
      }
    }
    Gameover();
  }, 200);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <div
        className="relative bg-slate-300"
        style={{
          width: areaWidth * zoom,
          height: areaHeight * zoom,
          backgroundColor: "#808000",
        }}
      >
        <div
          className="absolute bg-red-600 rounded"
          style={{
            top: food.top * zoom,
            left: food.left * zoom,
            width: zoom,
            height: zoom,
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
              backgroundColor: "#355E3B",
            }}
          ></div>
        ))}
      </div>
      <button onClick={handleRefresh}>Refresh</button>
    </main>
  );
}
