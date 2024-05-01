export default function QuestionPage() {
  return (
    <div className="p-8">
      <p className="text-center font-bold text-2xl mb-2">30</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-lg mx-auto mb-8">
        <div className="bg-blue-600 h-2.5 rounded-full w-4/5"></div>
        {/* <div className="bg-blue-600 h-2.5 rounded-full" style="width: 45%"></div> */}
      </div>
      <h1 className="font-bold text-4xl text-center mb-12">
        Question Text Here Lorem ipsum dolor sit amet consectetur, adipisicing elit.
      </h1>
      <div>
        <Choice text="Choice 1" />
        <Choice text="Choice 2" />
        <Choice text="Choice 3" />
        <Choice text="Choice 4" />
      </div>
    </div>
  )
}
type ChoiceType = {
  text: string
}

function Choice(props: ChoiceType) {
  return (
    <div className="bg-slate-50 shadow-sm rounded-sm max-w-lg p-4 mb-4 mx-auto">
      <h2 className="font-semibold text-2xl">{props.text}</h2>
    </div>
  )
}
