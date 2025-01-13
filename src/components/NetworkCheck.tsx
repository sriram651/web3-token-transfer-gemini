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

// Component to enforce network restrictions for Polygon Amoy
export default function NetworkCheck() {
  const { chainId, status } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();
  const isValidNetwork = chainId === polygonAmoy.id; // Check if the user is on the correct network

  // Trigger modal when connected to an invalid network
  useEffect(() => {
    if (status === "connected" && !isValidNetwork) {
      onOpen(); // Open the modal
    }
  }, [status, isValidNetwork, onOpen]);

  /**
   * Handles switching the user's network to Polygon Amoy.
   * If the network switch fails, disconnects the user.
   */
  async function handleSwitchNetwork() {
    try {
      await switchChainAsync({
        chainId: polygonAmoy.id, // Target network: Polygon Amoy only
      });

      onClose(); // Close the modal on successful switch
    } catch {
      await disconnectAsync(); // Disconnect the user if the switch fails for any reason
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      hideCloseButton // Remove the close button to make the modal non-dismissible
      isKeyboardDismissDisabled // Prevent modal dismissal using the keyboard
      isDismissable={false} // Prevent dismissal by clicking outside the modal
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
