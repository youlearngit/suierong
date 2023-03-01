/**
 * canvas utils
 */

/**
 * 绘制圆角矩形（纯色填充）
 * @param {*} context
 * @param {*} color
 * @param {*} x
 * @param {*} y
 * @param {*} w width
 * @param {*} h height
 * @param {*} r radian
 */
const roundRectColor = (context, color, x, y, w, h, r) => {
    context.save();
    context.setFillStyle(color);
    context.setStrokeStyle(color);
    context.setLineJoin("round"); //交点设置成圆角
    context.setLineWidth(r);
    context.strokeRect(x + r / 2, y + r / 2, w - r, h - r);
    context.fillRect(x + r / 2, y + r / 2, w - r * 1, h - r * 1);
    context.stroke();
    context.closePath();
};

// 圆角矩形边框
const roundRectColor2 = (context, color1, color2, x, y, w, h, r) => {
    context.save();
    context.setStrokeStyle(color2);
    context.setLineJoin("round"); //交点设置成圆角
    context.setLineWidth(r);
    context.strokeRect(x + r / 2, y + r / 2, w - r, h - r);
    context.fillRect(x + r / 2, y + r / 2, w - r * 1, h - r * 1);
    context.stroke();
    context.closePath();
};

module.exports = {
    roundRectColor: roundRectColor,
    roundRectColor2: roundRectColor2,
};
