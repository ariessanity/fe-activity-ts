import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { User } from "../../types";

const Posts: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [query, setQuery] = useState<any>({ name: "", username: "" });
  const [users, setUsers] = useState<User[]>(props.users);

  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const createForm = useForm<User>();
  const deleteForm = useForm<User>();
  const editForm = useForm<User>();

  const handleSearch = async (search: string) => {
    const resUsers = await fetch(`https://63438d663f83935a78552378.mockapi.io/user?search=${search}`);
    setUsers(await resUsers.json());
  };

  const handleQuery = async (user: any) => {
    setQuery(user);
  };

  //CREATE
  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      await fetch(`https://63438d663f83935a78552378.mockapi.io/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((data) => {
        if (data.ok) {
          console.log(data);
          createForm.reset();
          onFormClose;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  //DELETE
  const onDelete: SubmitHandler<any> = async (data) => {
    try {
      await fetch(`https://63438d663f83935a78552378.mockapi.io/user/${query.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((data) => {
        if (data.ok) {
          onDeleteClose();
        }
      });
      const resUsers = await fetch(`https://63438d663f83935a78552378.mockapi.io/user`);
      setUsers(await resUsers.json());
    } catch (error) {
      console.log(error);
    }
  };

  //EDIT
  const onUpdate: SubmitHandler<any> = async (data) => {
    try {
      await fetch(`https://63438d663f83935a78552378.mockapi.io/user/${query.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((data) => {
        if (data.ok) {
          console.log(query.id);
          onEditClose();
          editForm.reset();
        }
      });
      const resUsers = await fetch(`https://63438d663f83935a78552378.mockapi.io/user`);
      setUsers(await resUsers.json());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box w={"full"} h={"fit-content"}>
        <Button bg={"orange"} fontSize={"2xl"} onClick={onFormOpen}>
          ADD
        </Button>
        <Input onChange={(e) => handleSearch(e.target.value)} placeholder="Search" />
        <Divider />
        <List>
          {users.map((user) => (
            <ListItem key={user.id}>
              <Flex borderColor={"indigo"} borderWidth={2} borderRadius={"xl"} m={2} p={4} alignItems={"center"} gap={2} pos="relative">
                <Link href={`/users/${user.id}`}>
                  <Flex alignItems={"center"} gap={2}>
                    <Text>{user.name}</Text>
                    <Text as={"small"} color={"orange"}>
                      @{user.username}
                    </Text>
                  </Flex>
                </Link>
                <Button
                  colorScheme="teal"
                  pos="absolute"
                  top="2"
                  right="2"
                  onClick={(e) => {
                    handleQuery(user);
                    e.stopPropagation();
                    onEditOpen();
                  }}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  pos="absolute"
                  top="2"
                  right="20"
                  onClick={(e) => {
                    handleQuery(user);
                    e.stopPropagation();
                    onDeleteOpen();
                  }}
                >
                  Delete
                </Button>
              </Flex>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* MODAL FORM  */}
      <Modal isOpen={isFormOpen} onClose={onFormClose}>
        <ModalOverlay />
        <ModalContent as={"form"} onSubmit={createForm.handleSubmit(onSubmit)}>
          <ModalHeader>USER FORM</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <Input placeholder="Name" {...createForm.register("name", { required: true })} />
              <Input placeholder="Username" {...createForm.register("username", { required: true })} />
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button bg={"orange"} type="submit">
              Submit
            </Button>
            <Button onClick={onFormClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent as={"form"} onSubmit={editForm.handleSubmit(onUpdate)}>
          <ModalHeader>EDIT FORM</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <Input placeholder={query.name} {...editForm.register("name", { required: true })} />
              <Input placeholder={query.username} {...editForm.register("username", { required: true })} />
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button bg={"orange"} type="submit">
              Update
            </Button>
            <Button onClick={onEditClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>USER FORM</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Do you want to DELETE this item?</Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button bg={"orange"} onClick={deleteForm.handleSubmit(onDelete)}>
              Yes
            </Button>
            <Button onClick={onDeleteClose}>No</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const resUsers = await fetch("https://63438d663f83935a78552378.mockapi.io/user");
  const users = await resUsers.json();
  return { props: { users: users } };
};

export default Posts;
