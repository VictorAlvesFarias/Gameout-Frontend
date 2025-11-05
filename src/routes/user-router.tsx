import { FilePlus, ListMinus, CircleUser, SwatchBook, LucideMenu, FileText } from "lucide-react";
import React, { useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext, IAuthContextType } from "react-toolkit";
import SidebarRoot from "../components/sidebar-root";
import SidebarHref from "../components/sidebar-href";
import SidebarMenu from "../components/sidebar-menu";
import SidebarItem from "../components/sidebar-item";
import SidebarContent from "../components/sidebar-content";
import SidebarHamburguer from "../components/sidebar-hamburguer";
import { If } from "react-base-components";
import Cookies from 'js-cookie';
import { SidebarContext } from "react-base-components";
import { USER_ROUTES } from "../config/routes-config";
import { AccordionContext } from "react-base-components";
import { ModalContext } from "react-base-components"
import ModalRoot from '../components/modal-root'
import { ModalOpen } from "react-base-components"
import { ModalClose } from "react-base-components"
import Button from "../components/button";
import Add from "../pages/user/add/add";
import Home from "../pages/user/home/home";
import InProcessing from "../pages/user/in-processing/in-processing";
import Logs from "../pages/user/logs/logs";
import { AuthenticationService } from "typescript-toolkit";
import { AUTH } from "../config/auth-config";
import { loginService } from "../services/login-service";

function UserRouters() {
  const cookies = Cookies.get();
  const navigation = useNavigate()

  return (
    <SidebarContext>
      <SidebarRoot>
        <SidebarMenu>
          <SidebarItem redirect={() => {
            navigation(USER_ROUTES.PROFILE)
            return USER_ROUTES.PROFILE
          }}>
            <div className="flex gap-3 items-start flex-col">
              <div className="flex gap-3 items-center">
                <CircleUser className="w-7 h-7"></CircleUser>
                <span className="overflow-auto text-ellipsis">
                  <p>
                    {cookies.name ?? "User not found"}
                  </p>
                </span>
              </div>
            </div>
          </SidebarItem>
          <SidebarItem redirect={() => {
            navigation(USER_ROUTES.HOME)
            return USER_ROUTES.HOME
          }}>
            <SidebarHref><SwatchBook />Home</SidebarHref>
          </SidebarItem>
          <SidebarItem redirect={() => {
            navigation(USER_ROUTES.ADD)
            return USER_ROUTES.ADD
          }}>
            <SidebarHref><FilePlus />Add</SidebarHref>
          </SidebarItem>
          <SidebarItem redirect={() => {
            navigation(USER_ROUTES.IN_PROCESSING)
            return USER_ROUTES.IN_PROCESSING
          }}>
            <SidebarHref><ListMinus />In processing</SidebarHref>
          </SidebarItem>
          <SidebarItem redirect={() => {
            navigation(USER_ROUTES.LOGS)
            return USER_ROUTES.LOGS
          }}>
            <SidebarHref><FileText />Logs</SidebarHref>
          </SidebarItem>
          <ModalContext>
            <div className="flex-1 flex items-end w-full">
              <ModalOpen className="w-full h-fit">
                <SidebarItem unselectable disable href="" >
                  <SidebarHref >Exit </SidebarHref>
                </SidebarItem>
              </ModalOpen>
            </div>
            <ModalRoot>
              <div className='shadow-lg p-6 bg-main-black-800 flex flex-col gap-3 rounded text-white'>
                <p>Are you sure you want to leave?</p>
                <div className='flex justify-between w-full mt-6 gap-3'>
                  <ModalClose callback={() => loginService.logout()} className='flex justify-between flex-1'>
                    <Button variation="default-full">Exit</Button>
                  </ModalClose>
                  <ModalClose className='flex justify-between flex-1'>
                    <Button variation='red'>Cancel</Button>
                  </ModalClose>
                </div>
              </div>
            </ModalRoot>
          </ModalContext>
        </SidebarMenu>
        <SidebarHamburguer>
          <div className=" z-30 h-12 justify-end top-0 left-0  flex w-full bg-main-black-900 px-6  items-center ">
            <LucideMenu className="w-7 h-7 text-zinc-400" />
          </div>
        </SidebarHamburguer>
        <SidebarContent>
          <Routes>
            <Route path={USER_ROUTES.ADD} element={<Add />} />
            <Route path={USER_ROUTES.HOME} element={<Home />} />
            <Route path={USER_ROUTES.IN_PROCESSING} element={<InProcessing />} />
            <Route path={USER_ROUTES.LOGS} element={<Logs />} />
          </Routes>
        </SidebarContent>
      </SidebarRoot>
    </SidebarContext>
  );
}

export default UserRouters;
