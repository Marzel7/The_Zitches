import React from 'react'
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Center,
} from '@chakra-ui/react';

export default function MenuItems() {
    return (
        <Menu>
            <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={'https://avatars.githubusercontent.com/u/2925473?v=4'}
                  />
                </MenuButton>
            <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={'https://avatars.githubusercontent.com/u/2925473?v=4'}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>Kevin Keaveney</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>Your Servers</MenuItem>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem>Logout</MenuItem>
            </MenuList>
        </Menu>
    )
}
