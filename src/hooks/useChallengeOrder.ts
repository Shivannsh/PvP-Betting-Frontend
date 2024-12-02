import { useContractWrite } from 'wagmi';
import { abi } from '../helpers/abi';
import CONTRACT_ADDRESS from '../helpers/deployed_address';

export const useChallengeTrade = () => {
  return useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'challengeBetOrder',
  });
};
