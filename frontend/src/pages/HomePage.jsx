import React, { useEffect, useState } from 'react';
import { Container, VStack, Text, SimpleGrid, Spinner } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/product';
import ProductCard from '../components/ProductCard';
import { Helmet } from 'react-helmet';

const HomePage = () => {
  const { fetchProducts, products } = useProductStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      await fetchProducts();
      setLoading(false);
    };
    loadProducts();
  }, [fetchProducts]);

  return (
    <>
      <Helmet>
        <title>Product Store | Home</title>
        <link rel="icon" type="image/png" href="/home-icon.png" />
      </Helmet>

      <Container maxW="container.xl" py={12}>
        <VStack spacing={8}>
          <Text
            fontSize={'30'}
            fontWeight={'bold'}
            textAlign={'center'}
            bgGradient={'linear(to-r, cyan.400, blue.500)'}
            bgClip={'text'}
          >
            Current Products 🚀
          </Text>

          {loading ? (
            <Spinner size="xl" color="blue.500" />
          ) : products.length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={10}
              w={'full'}
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </SimpleGrid>
          ) : (
            <Text
              fontSize="xl"
              textAlign="center"
              fontWeight="bold"
              color="gray.500"
            >
              No products found 😢{' '}
              <Link to="/create">
                <Text
                  as="span"
                  color="blue.500"
                  _hover={{ textDecoration: 'underline' }}
                >
                  Create a product
                </Text>
              </Link>
            </Text>
          )}
        </VStack>
      </Container>
    </>
  );
};

export default HomePage;
