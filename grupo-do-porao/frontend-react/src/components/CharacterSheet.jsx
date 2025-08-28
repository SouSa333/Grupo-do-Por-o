
export default function CharacterSheet() {
  const { characters, dispatch } = useGame()
  const [character, setCharacter] = useState({
    id: Date.now(),
    name: '',
    class: '',
    race: '',
    level: 1,
    background: '',
    alignment: '',
    // Atributos
    attributes: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    // Recursos
    hitPoints: { current: 10, max: 10, temp: 0 },
    armorClass: 10,
    speed: 30,
    proficiencyBonus: 2,
    // Perícias
    skills: {},
    // Equipamentos
    equipment: [],
    // Magias
    spells: [],
    spellSlots: {},
    // Notas
    backstory: '',
    notes: '',
    // Aparência
    appearance: {
      age: '',
      height: '',
      weight: '',
      eyes: '',
      hair: '',
      skin: ''
    }
  })
  const [activeTab, setActiveTab] = useState('basic')
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  // Calcular modificador de atributo
  const getModifier = (score) => {
    return Math.floor((score - 10) / 2)
  }
  // Calcular bônus de perícia
  const getSkillBonus = (skill, attribute) => {
    const modifier = getModifier(character.attributes[attribute])
    const proficient = character.skills[skill]?.proficient || false
    const expertise = character.skills[skill]?.expertise || false
    let bonus = modifier
    if (proficient) bonus += character.proficiencyBonus
