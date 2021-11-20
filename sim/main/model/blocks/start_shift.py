from casymda.blocks import WaitForInterrupt

from .request import do_post


class StartShift(WaitForInterrupt):

    PATH = "/recalculate-pending-tours/"

    def __init__(
        self, env, name, xy=(0, 0), ways={}, at=1,
    ):
        super().__init__(env, name, xy=xy, ways=ways)

        self.at = at  # h
        self.env.process(self.sleep_and_wakeup())

    def sleep_and_wakeup(self):
        yield self.env.timeout(self.at)  # until wakeup
        self.request_tour_creation()
        for e in self.entities:
            e.current_process.interrupt()

    def request_tour_creation(self):
        result = do_post(self.PATH, {})
        num_created_tours = result["num_created_tours"]
        print(f"successfully created {num_created_tours} tours")
