import React, { useState } from 'react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useProductStore } from '../store/product';

const ProductCard = ({ product }) => {
  // Initialize state with the product data
  const [updatedProduct, setUpdatedProduct] = useState(product);

  const textColor = useColorModeValue('gray.600', 'gray.200');
  const bg = useColorModeValue('white', 'gray.800');

  // Destructure update, delete, and fetch functions from the store
  const { deleteProduct, updateProduct, fetchProducts } = useProductStore();
  const toast = useToast();

  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate,
  } = useDisclosure();
  const {
    isOpen: isOpenDel,
    onOpen: onOpenDel,
    onClose: onCloseDel,
  } = useDisclosure();

  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    if (!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Success',
        description: message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateProduct = async (pid, updatedProduct) => {
    const { success, message } = await updateProduct(pid, updatedProduct);
    onCloseUpdate();

    if (!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Success',
        description: 'Product Updated Successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Refetch products from the store to ensure UI updates immediately
      await fetchProducts();
    }
  };

  const modalBg = useColorModeValue('white', 'gray.700');

  return (
    <Box
      shadow="lg"
      rounded="xl"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: '2xl' }}
      bg={bg}
    >
      <Image
        src={product.image}
        alt={product.image}
        h={48}
        w="full"
        objectFit="cover"
      />

      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {product.name}
        </Heading>

        <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
          Rs. {product.price}
        </Text>

        <HStack spacing={2}>
          <IconButton
            icon={<EditIcon />}
            onClick={onOpenUpdate}
            colorScheme="blue"
          />
          <IconButton
            icon={<DeleteIcon />}
            onClick={onOpenDel}
            colorScheme="red"
          />
        </HStack>
      </Box>

      <Modal onClose={onCloseUpdate} isOpen={isOpenUpdate}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Product Name"
                name="name"
                value={updatedProduct.name}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    name: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Price"
                name="price"
                type="number"
                value={updatedProduct.price}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    price: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Image URL"
                name="image"
                value={updatedProduct.image}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    image: e.target.value,
                  })
                }
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdateProduct(product._id, updatedProduct)}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onCloseUpdate}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        onClose={onCloseDel}
        isOpen={isOpenDel}
        isCentered // ✅ This centers the modal vertically
        motionPreset="scale" // ✅ Adds a nice scale animation
      >
        <ModalOverlay />
        <ModalContent
          bg={modalBg}
          rounded="lg"
          shadow="xl"
          mx={4} // ✅ Add horizontal padding for mobile view
        >
          <ModalHeader fontWeight="bold" fontSize="lg" textAlign="center">
            Confirm Deletion
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody textAlign="center" fontSize="md" py={6}>
            Are you sure you want to delete this product? This action is
            irreversible.
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleDeleteProduct(product._id)}
            >
              Yes, Delete
            </Button>
            <Button variant="ghost" onClick={onCloseDel}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductCard;
