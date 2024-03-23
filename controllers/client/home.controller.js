
// [GET] /
module.exports.index = async (req, res) => {

    res.render("clients/pages/home/index.pug", {
        pageTitle: 'Trang chủ',

    })
}