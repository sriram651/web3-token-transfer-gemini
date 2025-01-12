import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect } from "react";
import { polygonAmoy } from "viem/chains";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";

export default function NetworkCheck() {
  const { chainId, status } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();
  const isValidNetwork = chainId === polygonAmoy.id;

  useEffect(() => {
    if (status === "connected" && !isValidNetwork) {
      onOpen();
    }
  }, [status, isValidNetwork, onOpen]);

  async function handleSwitchNetwork() {
    try {
      await switchChainAsync({
        chainId: polygonAmoy.id,
      });

      onClose();
    } catch {
      await disconnectAsync();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      hideCloseButton
      isKeyboardDismissDisabled
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader>Network Switch Required</ModalHeader>

        <ModalBody>
          <p>
            Please switch to the Polygon Amoy network to continue using this
            application.
          </p>
        </ModalBody>

        <ModalFooter>
          <Button
            color="warning"
            size="md"
            radius="md"
            onPress={handleSwitchNetwork}
          >
            Switch Network
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
