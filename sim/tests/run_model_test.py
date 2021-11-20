from main.model.model import Model
from simpy import Environment


def test_model_execution():
    env = Environment()
    model = Model(env)
    env.run()
    assert model.customer_sink.overall_count_in == model.customer_source.max_entities
