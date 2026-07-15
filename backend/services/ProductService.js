const Product = require('../models/Product');
const logger = require('../utils/logger');

class ProductService {
    /**
     * Search products based on AI intent slots
     * @param {Object} slots 
     */
    async searchProducts(slots) {
        const mongoQuery = this.buildQuery(slots);

        try {
            let query = Product.find(mongoQuery);

            // Sorting Logic
            if (slots.sort === 'price_asc') {
                query = query.sort({ price: 1 });
            } else if (slots.sort === 'price_desc') {
                query = query.sort({ price: -1 });
            } else if (slots.sort === 'newest') {
                query = query.sort({ createdAt: -1 });
            }

            return await query;
        } catch (error) {
            logger.error(`ProductService searchProducts Error: ${error.message}`);
            throw error;
        }
    }

    /**
     * Translates AI slots into Mongoose query object
     * @param {Object} slots 
     */
    buildQuery(slots) {
        const query = {};

        // 1. Text Search (using directives)
        if (slots.product) {
            query.$text = { $search: slots.product };
        }

        // 2. Price Logic
        if (slots.price_constraint) {
            const { operator, value } = slots.price_constraint;

            if (operator === 'lt') {
                query.price = { ...query.price, $lte: value };
            } else if (operator === 'gt') {
                query.price = { ...query.price, $gte: value };
            } else if (operator === 'eq') {
                query.price = value;
            }
        }

        // 3. Adjectives/Filters (Additional fuzzy or exact matches)
        if (slots.adjectives && slots.adjectives.length > 0) {
            // Could be used for further filtering if not already in text search
        }

        return query;
    }
}

module.exports = new ProductService();
