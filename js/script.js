'use strict';

let displayValue = '0';  // ディスプレイの値
let btnValue = '';  //電卓で押下したボタンの値
let previousValue = ''; // 前に入力した数値
let operator = '';      // 四則演算格納用
let inputValue = '';    // 計算式表示用

const BUTTON_FOUR_ARITHMETIC_OPERATIONS = '+-×÷';  // 四則演算
const BUTTON_NUM = /^[0-9]$/;   // 範囲0～9を含む1文字の正規表現
const $display = document.querySelector(".display");    // ディスプレイ部要素
const $inputLabel = document.querySelector(".inputlabel");  // 計算式表示部要素
const $btnBackspace = document.querySelector(".btn-backspace"); // ←ボタン要素
const $btnDevide = document.querySelector(".btn-devide");   // ÷ボタン要素
const $btnMulti = document.querySelector(".btn-multi"); // ×ボタン要素
const $btnMinus = document.querySelector(".btn-minus"); // -ボタン要素
const $btnPlus = document.querySelector(".btn-plus");   // +ボタン要素
const $btnEqual = document.querySelector(".btn-equal"); // =ボタン要素
const $btnDecipoint = document.querySelector(".btn-decipoint"); // .ボタン要素

// 電卓のボタン押下処理
function btnClick(btntag) {
    btnValue = btntag.value;    // 押下したボタンの値を取得
    // ボタン押下時にディスプレイが0表示で0ボタン押下の場合、ディスプレイは0のまま。
    if (displayValue === '0' && btnValue === '0') {
        updateDisplay(displayValue);
        // 「0」を押下時でディスプレイ部が「0」の場合は「←.」ボタンは活性にする。
        $btnBackspace.disabled && btnBsChangeDisabled();
        $btnDecipoint.disabled && btnDeciPointChangeDisabled();
        !$btnDevide.disabled && btnOpeChangeDisabled();
        !$btnEqual.disabled && btnEqualChangeDisabled();
        return;
    }

    
    // クリア押下時
    if (btnValue === 'C') {
        pushClear();
    // =ボタン押下時
    } else if (btnValue === '='){
        pushEqual();
    // 数値ボタン押下時
    } else if (BUTTON_NUM.test(btnValue)){
        pushNum();
    // +-×÷ボタン押下時
    } else if (BUTTON_FOUR_ARITHMETIC_operations.includes(btnValue)) {
        pushOpe();
    // ←ボタン押下時
    } else if (btnValue === '←'){
        pushBksp();
    // 少数点ボタン押下時
    } else if (btnValue === '.'){
        pushDeciPoint();
    }
}

// 数値ボタン押下時の処理
function pushNum() {
    // 0の場合と記号押下直後の数値ボタン押下は押された数値を表示、それ以外は数値を連結して表示
    if (BUTTON_NUM.test(btnValue) && displayValue === '0'){
        displayValue = btnValue;
    } else {
        displayValue += btnValue;
    }
    updateDisplay(displayValue);

    // =押下後に数値押下した場合は計算式ラベル部を空白表示
    if (operator === '') {
        updateInputDisplay('');
    }
    // ←÷×+-=.ボタン活性
    $btnBackspace.disabled && btnBsChangeDisabled();
    $btnDevide.disabled && btnOpeChangeDisabled();
    $btnEqual.disabled && btnEqualChangeDisabled();
    $btnDecipoint.disabled && btnDeciPointChangeDisabled();
}

// 小数点押下時の処理
function pushDeciPoint() {
    displayValue += btnValue;
    updateDisplay(displayValue);
    // ←ボタン非活性
    $btnBackspace.disabled && btnBsChangeDisabled();
}

// 演算記号押下時の処理
function pushOpe(){
    // ボタン押下時に四則演算が入力されてない場合はディスプレイ内容＋ボタン内容をラベル部に表示。
    // 四則演算が入力されている場合は計算結果+ボタン内容をラベル部に表示
    if(operator === ''){
        inputValue = (displayValue + btnValue);
        previousValue = displayValue;
        displayValue = '0';
    } else {
        // 既に計算式が成り立っている場合、再度計算を行うために一度計算処理を行う。
        // 例：「1+2」の状態で+ボタン押下された場合は「3+」の状態にする。
        calc();
        inputValue = (previousValue + btnValue);
    }

    operator = btnValue;    // 演算記号を格納
    updateInputDisplay(inputValue);
    // ←÷×+-=.ボタン非活性
    !$btnBackspace.disabled && btnBsChangeDisabled();
    !$btnDevide.disabled && btnOpeChangeDisabled();
    !$btnEqual.disabled && btnEqualChangeDisabled();
    !$btnDecipoint.disabled && btnDeciPointChangeDisabled();
}

// 「C」ボタン押下時の処理
// クリア押下時はディスプレイ、ラベル部を未入力状態にする。
function pushClear(){
    resetDisplay();
    updateDisplay(displayValue);
    updateInputDisplay('');
    // ←.活性、÷×+-=ボタン非活性
    $btnBackspace.disabled && btnBsChangeDisabled();
    !$btnDevide.disabled && btnOpeChangeDisabled();
    !$btnEqual.disabled && btnEqualChangeDisabled();
    $btnDecipoint.disabled && btnDeciPointChangeDisabled();
}

// =ボタン押下処理
// 計算式をラベル部に表示し、計算処理を実施。ディスプレイには計算結果を表示。
function pushEqual(){
    inputValue += (displayValue + btnValue);
    updateInputDisplay(inputValue);
    calc();
    // ←÷×+-=.ボタン非活性
    !$btnBackspace.disabled && btnBsChangeDisabled();
    !$btnDevide.disabled && btnOpeChangeDisabled();
    !$btnEqual.disabled && btnEqualChangeDisabled();
    !$btnDecipoint.disabled && btnDeciPointChangeDisabled();
}

// backspace押下時（ディスプレイ最後の1文字を削除する）
function pushBksp() {
    displayValue = displayValue.slice(0, -1);
    // console.log('displayValue: ' + displayValue);
    // バックスペース時に削除文字がない場合はディスプレイ0表示
    (displayValue === '') && (displayValue = '0');
    updateDisplay(displayValue);
    if(displayValue == '0'){
        !$btnDevide.disabled && btnOpeChangeDisabled();
        !$btnEqual.disabled && btnEqualChangeDisabled();
    }
}

// 計算処理
function calc() {
    let calcResult; // 計算結果

    // 計算する数値が文字列型なので数値型に変換して計算処理を実施。
    previousValue = parseFloat(previousValue);
    displayValue = parseFloat(displayValue);
    // 演算記号をもとに計算処理を実施
    switch(operator) {
        case '+':
            calcResult = previousValue + displayValue;
            break;
        case '-':
            calcResult = previousValue - displayValue;
            break;
        case '×':
            calcResult = previousValue * displayValue;
            break;
        case '÷':
            calcResult = previousValue / displayValue;
            break;
    }
    updateDisplay(calcResult);  // 計算結果をディスプレイ部に表示
    resetDisplay(); // 計算結果ラベル、ディスプレイ初期表示にする。
    previousValue = calcResult; // 計算結果を前回入力数値として格納。
}

// 「C」ボタン押下時の処理
// 各種変数の初期化とディスプレイ0表示
function resetDisplay() {
    displayValue = '0';
    previousValue = '';
    operator = '';
    inputValue = '';
}

// ディスプレイ表示更新
function updateDisplay(value) {
    $display.value = value;
}

// 入力内容（ラベル部）表示更新
function updateInputDisplay(value) {
    // console.log(inputValue);
    $inputLabel.textContent = value;
}

// 「←」ボタンの活性⇔非活性切り替え
function btnBsChangeDisabled(){
    $btnBackspace.disabled ? $btnBackspace.disabled = false : $btnBackspace.disabled = true;
}

// 四則演算の活性⇔非活性切り替え
function btnOpeChangeDisabled(){
    $btnDevide.disabled ? $btnDevide.disabled = false : $btnDevide.disabled = true;
    $btnMulti.disabled ? $btnMulti.disabled = false : $btnMulti.disabled = true;
    $btnMinus.disabled ? $btnMinus.disabled = false : $btnMinus.disabled = true;
    $btnPlus.disabled ? $btnPlus.disabled = false : $btnPlus.disabled = true;
}

// イコールの活性・非活性切り替え
function btnEqualChangeDisabled(){
    $btnEqual.disabled ? $btnEqual.disabled = false : $btnEqual.disabled = true;
}

// イコールの活性・非活性切り替え
function btnDeciPointChangeDisabled(){
    $btnDecipoint.disabled ? $btnDecipoint.disabled = false : $btnDecipoint.disabled = true;
}