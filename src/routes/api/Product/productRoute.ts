import express from 'express';
import ProductModel from './Product';

const router = express.Router();


type IProduct = {
    _id: string;
    name: string;
    price: number;
    description: string;

}

type IProductListQuery = {
    min: string;
    max: string;
    sort: string;
}

router.get('/', async (req, res) => {

    const queryParams = req.query as IProductListQuery;
    const min = queryParams.min && !isNaN(parseInt(queryParams.min, 10)) ? parseInt(queryParams.min, 10) : undefined;
    const max = queryParams.max && !isNaN(parseInt(queryParams.max, 10)) ? parseInt(queryParams.max, 10) : undefined;
    const sortDirection = queryParams.sort || 'ASC';


    const query = (min !== undefined|| max !== undefined) ? {
        price: {
            ...(min !== undefined ? {$gte: min} : {}),
            ...(max !== undefined ? {$lte: max} : {})
        }
    } : {}
    ProductModel.find(query)
    .sort({price: sortDirection === 'ASC' ? 1 : -1})
    .exec((err, docs) => {
        if (err) {
            res.statusCode = 404;
            res.json({ msg: err.message });
        } else {
            res.statusCode = 200;
            res.json(docs);
        }
    });
})

router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    ProductModel.findById(productId, {}, {}, (err, doc) => {
        if (err) {
            res.statusCode = 404;
            res.json({ msg: err.message });
        } else {
            res.statusCode = 200;
            res.json(doc);
        }
    });
});


const checkProductInfo = ((productInfo: IProduct) => {
    delete productInfo._id;
    if (!productInfo.name || !productInfo.description) return false;
    if (isNaN(productInfo.price)) return false;
    if (!isFinite(productInfo.price)) return false;
    else return true;
});

router.post('/', async (req, res) => {
    const newProductInfo = req.body;
    console.debug(newProductInfo);
    const isValidProductInfo = checkProductInfo(newProductInfo);
    if (isValidProductInfo) {
        const newProduct = new ProductModel({ ...newProductInfo });
        newProduct.save()
            .then(value => {
                console.log('Successfully saved the product');
                res.json({ msg: 'Saved Product details successfully', id: value._id });
            }).catch(error => {
                console.log(error.message);
                res.statusCode = 502;
                res.json({ msg: 'Failed to save the product! Please try again' });
            });
    } else {
        res.statusCode = 400;
        res.json({ msg: 'Product info is valid try again' });
    }

});

router.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedProductInfo: IProduct = req.body;
    ProductModel.findById(productId, {}, {}, (err, doc) => {
        if (err) {
            console.log(err);
            res.statusCode = 502;
            res.json({ msg: 'Failed to update the product! Please try again' });
        } else {
            doc.name = updatedProductInfo.name || doc.name;
            doc.description = updatedProductInfo.description || doc.description;
            doc.price = updatedProductInfo.price || doc.price;
            doc.save()
                .then(value => {
                    if(value === null) {
                        console.log('Product not found');
                        res.statusCode = 400;
                        res.json({ msg: "Product not found", id: productId });
                    }
                    console.log('Successfully updated the product');
                    res.json({ msg: "Product details updated successfully", id: productId });
                }).catch(error => {
                    console.log(error.message);
                    res.statusCode = 502;
                    res.json({ msg: 'Failed to update the product! Please try again' });
                });
        }
    });
});

router.delete('/:id', async (req, res) => {
    const productId = req.params.id;
    ProductModel.findByIdAndDelete(productId, {}, (err, doc) => {
        if (err) {
            console.log(err.message);
            res.statusCode = 501;
            res.json({ msg: 'Failed to delete the product', deleted: false });
        } else {
            console.log(doc);
            if (doc === null) {
                res.statusCode = 400;
                res.json({ msg: 'Delete unsuccessful', deleted: false });
            } else {
                res.statusCode = 200;
                res.json({ msg: 'Delete successfull', deleted: true });

            }

        }
    });
});




export { router as productRouter };