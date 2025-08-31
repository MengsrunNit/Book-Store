exports.error404 = (req, res, next)=>{
    res.status(404).render('404', {pageTitle: 'This page is 404 Error my friend', path:'/404'})
};