class TestRunner {
  constructor(name) {
    this.name = name;
    this.testNo = 1;
  }

  expectTrue(cond) {
    try {
      if (cond()) {
        this._pass();
      } else {
        this._fail();
      }
    } catch (e) {
      this._fail(e);
    }
  }

  expectFalse(cond) {
    this.expectTrue(() => !cond());
  }

  expectException(block) {
    try {
      block();
      this._fail();
    } catch (e) {
      this._pass();
    }
  }

  _fail(e = undefined) {
    console.log(`FAILED: Test #${this.testNo++} of ${this.name}`);
    if (e != undefined) {
      console.log(e);
    }
  }

  _pass() {
    console.log(`PASSED: Test #${this.testNo++} of ${this.name}`);
  }
}

const tasks = {
  id: 0,
  name: "Все задачи",
  children: [
    {
      id: 1,
      name: "Разработка",
      children: [
        { id: 2, name: "Планирование разработок", priority: 1 },
        { id: 3, name: "Подготовка релиза", priority: 4 },
        { id: 4, name: "Оптимизация", priority: 2 },
      ],
    },
    {
      id: 5,
      name: "Тестирование",
      children: [
        {
          id: 6,
          name: "Ручное тестирование",
          children: [
            { id: 7, name: "Составление тест-планов", priority: 3 },
            { id: 8, name: "Выполнение тестов", priority: 6 },
          ],
        },
        {
          id: 9,
          name: "Автоматическое тестирование",
          children: [
            { id: 10, name: "Составление тест-планов", priority: 3 },
            { id: 11, name: "Написание тестов", priority: 3 },
          ],
        },
      ],
    },
    { id: 12, name: "Аналитика", children: [] },
  ],
};

function findTaskHavingMaxPriorityInGroup({ tasks, groupId }) {
  let searchGroup = tasks;
  let result;

  while (
    searchGroup.children !== undefined &&
    searchGroup.children.length !== 0
  ) {
    searchGroup = searchGroup.children[searchGroup.children.length - 1];
  }
  if (groupId > searchGroup.id) throw "Error";
  else searchGroup = tasks;

  if(tasks.id === groupId)
    result = tasks;
  else {
    for (let i = 0; i < searchGroup.children.length; i++) {
      if (searchGroup.children[i].id === groupId) {
        result = searchGroup.children[i];
        break;
      }
  
      if (searchGroup.children[i].id > groupId) {
        searchGroup = searchGroup.children[i - 1];
        i = -1;
      }
    }
  }

  return true;

  // var result = 0;
  // for (let i = 0; i < tasks.children.length; i++) {
  //   if(tasks.children[i].id === groupId) {
  //     result = tasks.children[i];
  //     break;
  //   }

  //   if(tasks.children[i].id>groupId)
  //     findTaskHavingMaxPriorityInGroup(tasks.children[i-1], groupId);

  // }
}

function taskEquals(a, b) {
  return (
    a.children == undefined &&
    b.children == undefined &&
    a.id == b.id &&
    a.name == b.name &&
    a.priority == b.priority
  );
}

function testFindTaskHavingMaxPriorityInGroup() {
  const runner = new TestRunner("findTaskHavingMaxPriorityInGroup");

  runner.expectException(() =>
    findTaskHavingMaxPriorityInGroup({ tasks, groupId: 13 })
  );
  runner.expectException(() =>
    findTaskHavingMaxPriorityInGroup({ tasks, groupId: 2 })
  );

  runner.expectTrue(
    () => findTaskHavingMaxPriorityInGroup({ tasks, groupId: 12 }) == undefined
  );

  runner.expectTrue(() =>
    taskEquals(findTaskHavingMaxPriorityInGroup({ tasks, groupId: 0 }), {
      id: 8,
      name: "Выполнение тестов",
      priority: 6,
    })
  );
  runner.expectTrue(() =>
    taskEquals(findTaskHavingMaxPriorityInGroup({ tasks, groupId: 1 }), {
      id: 3,
      name: "Подготовка релиза",
      priority: 4,
    })
  );
  runner.expectTrue(
    () => findTaskHavingMaxPriorityInGroup({ tasks, groupId: 9 }).priority == 3
  );
}
