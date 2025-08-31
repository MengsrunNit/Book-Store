const fs = require('fs');
const path = require('path'); 

const p = path.join(path.dirname(process.mainModule.filename), 
        'data', 
        'cart.json'); 


class Cart{
    static addProduct(id, productPrice, cb){
        //fetch the previous cart
        fs.readFile(p, (err, fileContent)=>{
            let cart = {products:[], totalPrice: 0}
            if(!err && fileContent.length > 0){
                cart = JSON.parse(fileContent);
                console.log(cart.products);
            }
            console.log(cart.products);

            const existingProductIndex = cart.products.findIndex(prod => prod.id === id); 
            const existingProduct = cart.products[existingProductIndex]
            let updatingProduct; 
            if (existingProduct){
                updatingProduct = {...existingProduct}; 
                updatingProduct.qty = updatingProduct.qty + 1
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatingProduct; 
            }
            else{
                updatingProduct = { id: id, qty : 1}
                // cart.products = {...cart.product, updatingProduct}
                cart.products.push(updatingProduct);
            }

            cart.totalPrice = parseInt(cart.totalPrice) + parseInt(productPrice); 
           
            fs.writeFile(p, JSON.stringify(cart), err=>{
                if (err){
                    console.log(err);
                }
            cb()
            });
        })
    }

    static deleteProduct(id, productPrice){
        fs.readFile(p, (err, fileContent)=>{
            if(err){
                return 
            }
            const parsedContent = JSON.parse(fileContent.toString());
            const updateProduct = parsedContent;
            const product = updateProduct.products.find(prod => prod.id === id);
            if (!product){
                return; 
            }
            updateProduct.products = updateProduct.products.filter(product => product.id !== id)
            const productQty = product.qty; 
            updateProduct.totalPrice = updateProduct.totalPrice - productPrice * productQty; 
            fs.writeFile(p, JSON.stringify(updateProduct), err=>{
                console.log(err);
            });
        })
    }

    static getProduct(cb){
        fs.readFile(p, (err, fileContent)=>{
            //parse the data 
            const cart = JSON.parse(fileContent); 
            // check if there is error 
            if(err){
                cb(null)
            }else{
                cb(cart)
            }
        });

    }

}

module.exports = Cart; // Export the class directly