// [get] /

module.exports.index = (req, res) => {
    res.render("clients/pages/home/index.pug", {
        pageTitle: 'Home'
    })
}