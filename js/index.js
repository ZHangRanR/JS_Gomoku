// 函数封装
function $(ele) {
    return document.querySelector(ele);
}

let chessboard = $('.chessboard'); // 获取棋盘的 table
let isGameOver = false; // 用以游戏是否结束
let whichOne = 'white'; // 初始为白色的棋子
let chessArr = []; //  存储所有已落子的棋子信息

// 初始化棋盘
// 绘制一个 14x14 的棋盘格子
function initChessboard() {
    let tableContent = "";
    // 循环生成行
    for (let i = 0; i < 14; i++) {
        let row = '<tr>';
        // 循环生成列
        for (let j = 0; j < 14; j++) {
            // 将每一行 和 每一列 对应的下标 存储到 元素自定义属性中
            row += `<td data-row='${i}' data-col='${j}'></td>`;
        }
        row += '</tr>';
        tableContent += row;
    }
    chessboard.innerHTML = tableContent;

    // 绑定事件
    bindEvent();
}

// 点击事件
function bindEvent() {
    // 为棋盘添加点击事件
    chessboard.onclick = function (e) {
        if (!isGameOver) { // 判断游戏是否结束
            // 游戏未结束时, 获取触发点击事件的元素信息
            let temp = Object.assign({}, e.target.dataset);
            if (e.target.nodeName === 'TD') {
                // 计算出每个格子的边长
                let tdw = chessboard.clientWidth * 0.92 / 14;

                // 确认用户落子位置为方格四角中的哪一个角
                let positionX = e.offsetX > tdw / 2; // 鼠标的落点位置是否在方块的右半边
                let positionY = e.offsetY > tdw / 2; // 鼠标的落点位置是否在方块的下半边

                // 将棋子落子位置以及棋子颜色存储到 chesspoint 对象中
                let chessPoint = {
                    x: positionX ? parseInt(temp.col) + 1 : parseInt(temp.col),
                    y: positionY ? parseInt(temp.row) + 1 : parseInt(temp.row),
                    c: whichOne
                }

                // 将棋子信息作为参数传入到 chessMove 函数中, 绘制棋子
                chessMove(chessPoint);
            }

        } else {
            // 游戏已经结束，询问是否要重新开始
            if (window.confirm('是否要重新开始？')) {
                // 初始化操作
                chessArr = []; // 重置棋子的数组
                initChessboard(); // 重新绘制棋盘
                isGameOver = false;
            }
        }
    }
}

// 绘制棋子，接收一个存储 棋子信息的对象 作为参数 
function chessMove(chessPoint) {
    // 断一下该位置是否存在棋子，如果有棋子，不再绘制
    if (exist(chessPoint) && !isGameOver) {
        // 该位置没有棋子, 且游戏进行中
        chessArr.push(chessPoint); // 将该棋子的信息存入到数组

        // 生成一个棋子
        let newChess = `<div class="chess ${chessPoint.c}" data-row="${chessPoint.y}" data-col="${chessPoint.x}"></div>`;

        // 根据不同的落子位置，调整棋子
        if (chessPoint.x < 14 && chessPoint.y < 14) {
            let tdPos = $(`td[data-row='${chessPoint.y}'][data-col='${chessPoint.x}']`);
            tdPos.innerHTML += newChess;
        }

        // x 等于 14，说明棋子落点为棋盘最右侧的竖线上
        if (chessPoint.x === 14 && chessPoint.y < 14) {
            let tdPos = $(`td[data-row='${chessPoint.y}'][data-col='13']`);
            tdPos.innerHTML += newChess;
            tdPos.lastChild.style.left = '50%';
        }

        // y 等于 14，说明棋子落点为棋盘最下方的横线上
        if (chessPoint.x < 14 && chessPoint.y === 14) {
            let tdPos = $(`td[data-row='13'][data-col='${chessPoint.x}']`);
            tdPos.innerHTML += newChess;
            tdPos.lastChild.style.top = '50%';
        }

        // x 和 y 均等于 14，说明是最右下角的那个 td
        if (chessPoint.x === 14 && chessPoint.y === 14) {
            let tdPos = $(`td[data-row='13'][data-col='13']`);
            tdPos.innerHTML += newChess;
            tdPos.lastChild.style.top = '50%';
            tdPos.lastChild.style.left = '50%';
        }

        whichOne = whichOne === 'white' ? 'black' : 'white'; // 切换棋子的颜色
    }

    check(); // 核对游戏是否结束
}

// 判断该棋子是否已经存在
function exist(chessPoint) {
    let result = chessArr.find(function (item) {
        return item.x === chessPoint.x && item.y === chessPoint.y;
    })
    return result === undefined ? true : false;
}

// 检查是否有连成五子的同色棋子
function check() {
    // 遍历数组里面的每一个棋子
    for (let i = 0; i < chessArr.length; i++) {
        let curChess = chessArr[i];
        let chess2, chess3, chess4, chess5;

        // 检查有没有横着的 5 个颜色一样的棋子
        chess2 = chessArr.find(function (item) {
            return curChess.x === item.x + 1 && curChess.y === item.y && curChess.c === item.c;
        })
        chess3 = chessArr.find(function (item) {
            return curChess.x === item.x + 2 && curChess.y === item.y && curChess.c === item.c;
        })
        chess4 = chessArr.find(function (item) {
            return curChess.x === item.x + 3 && curChess.y === item.y && curChess.c === item.c;
        })
        chess5 = chessArr.find(function (item) {
            return curChess.x === item.x + 4 && curChess.y === item.y && curChess.c === item.c;
        })
        if (chess2 && chess3 && chess4 && chess5) {
            // 连成五子，游戏结束
            end(curChess, chess2, chess3, chess4, chess5);
        }


        // 检查有没有竖着的 5 个颜色一样的棋子
        chess2 = chessArr.find(function (item) {
            return curChess.x === item.x && curChess.y === item.y + 1 && curChess.c === item.c;
        })
        chess3 = chessArr.find(function (item) {
            return curChess.x === item.x && curChess.y === item.y + 2 && curChess.c === item.c;
        })
        chess4 = chessArr.find(function (item) {
            return curChess.x === item.x && curChess.y === item.y + 3 && curChess.c === item.c;
        })
        chess5 = chessArr.find(function (item) {
            return curChess.x === item.x && curChess.y === item.y + 4 && curChess.c === item.c;
        })
        if (chess2 && chess3 && chess4 && chess5) {
            // 进入此 if，说明游戏结束
            end(curChess, chess2, chess3, chess4, chess5);
        }

        // 检查有没有斜着的 5 个颜色一样的棋子
        chess2 = chessArr.find(function (item) {
            return curChess.x === item.x + 1 && curChess.y === item.y + 1 && curChess.c === item.c;
        })
        chess3 = chessArr.find(function (item) {
            return curChess.x === item.x + 2 && curChess.y === item.y + 2 && curChess.c === item.c;
        })
        chess4 = chessArr.find(function (item) {
            return curChess.x === item.x + 3 && curChess.y === item.y + 3 && curChess.c === item.c;
        })
        chess5 = chessArr.find(function (item) {
            return curChess.x === item.x + 4 && curChess.y === item.y + 4 && curChess.c === item.c;
        })
        if (chess2 && chess3 && chess4 && chess5) {
            // 进入此 if，说明游戏结束
            end(curChess, chess2, chess3, chess4, chess5);
        }

        // 检查有没有斜着的 5 个颜色一样的棋子
        chess2 = chessArr.find(function (item) {
            return curChess.x === item.x - 1 && curChess.y === item.y + 1 && curChess.c === item.c;
        })
        chess3 = chessArr.find(function (item) {
            return curChess.x === item.x - 2 && curChess.y === item.y + 2 && curChess.c === item.c;
        })
        chess4 = chessArr.find(function (item) {
            return curChess.x === item.x - 3 && curChess.y === item.y + 3 && curChess.c === item.c;
        })
        chess5 = chessArr.find(function (item) {
            return curChess.x === item.x - 4 && curChess.y === item.y + 4 && curChess.c === item.c;
        })
        if (chess2 && chess3 && chess4 && chess5) {
            // 进入此 if，说明游戏结束
            end(curChess, chess2, chess3, chess4, chess5);
        }
    }
}

function end() {
    if (!isGameOver) {
        isGameOver = true; // 游戏结束

        // 1. 将棋子的落子顺序在页面显示
        for (let i = 0; i < chessArr.length; i++) {
            $(`div[data-row='${chessArr[i].y}'][data-col='${chessArr[i].x}']`).innerHTML = i + 1;
        }

        // 2. 为连成五子的棋子添加特殊样式
        for (let i = 0; i < arguments.length; i++) {
            $(`div[data-row='${arguments[i].y}'][data-col='${arguments[i].x}']`).classList.add('win');
        }
    }
}



// 初始化棋盘
initChessboard();

