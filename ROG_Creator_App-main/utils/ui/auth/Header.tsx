import { View } from 'react-native';
import HelpButton from '../common/HelpButton';
import BackButton from '../common/BackButton';
import { useRouter } from 'react-native-auto-route';

export default function Header({
  helpOpen,
  setHelpOpen,
}: {
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between mb-4 mx-4 ml-2">
      <BackButton
        onPress={() => router.pop(1)}
        title=""
        variant="outline"
        size="lg"
      />
      <HelpButton
        title="Help"
        onPress={() => setHelpOpen(!helpOpen)}
        size="md"
        variant="primary"
      />
    </View>
  );
}
